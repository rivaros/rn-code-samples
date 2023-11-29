#import <Bugsnag/Bugsnag.h>
#import "AppDelegate.h"

#import <CodePush/CodePush.h>

#import "tpcmobile-Swift.h"
#import "FirebaseCore.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTLog.h>

#import "ReactNativeConfig.h"
#import "BraintreeCore.h"

#import "BrazeReactUtils.h"
#import <BrazeKit/BrazeKit-Swift.h>
#import "BrazeReactBridge.h"


// Part added to deal with react-native-encrypted-storage
// https://github.com/emeraldsanto/react-native-encrypted-storage#note-regarding-keychain-persistence
/**
 Deletes all Keychain items accessible by this app if this is the first time the user launches the app
 */
static void ClearKeychainIfNecessary() {
    // Checks wether or not this is the first time the app is run
    if ([[NSUserDefaults standardUserDefaults] boolForKey:@"HAS_RUN_BEFORE"] == NO) {
        // Set the appropriate value so we don't clear next time the app is launched
        [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"HAS_RUN_BEFORE"];

        NSArray *secItemClasses = @[
            (__bridge id)kSecClassGenericPassword,
            (__bridge id)kSecClassInternetPassword,
            (__bridge id)kSecClassCertificate,
            (__bridge id)kSecClassKey,
            (__bridge id)kSecClassIdentity
        ];

        // Maps through all Keychain classes and deletes all items that match
        for (id secItemClass in secItemClasses) {
            NSDictionary *spec = @{(__bridge id)kSecClass: secItemClass};
            SecItemDelete((__bridge CFDictionaryRef)spec);
        }
    }
}

@implementation AppDelegate

#pragma mark - AppDelegate.braze

static Braze *_braze = nil;

static NSString* const brazeApiKey = [ReactNativeConfig envFor:@"BRAZE_API_KEY"];
static NSString* const brazeEndpoint = [ReactNativeConfig envFor:@"BRAZE_ENDPOINT"];

// Create Object of class MyAppPushNotificationsHandler
TpcPushNotificationsHandler* pnHandlerObj = [[TpcPushNotificationsHandler alloc] init];

#pragma mark - Payments

- (NSString *)paymentsURLScheme {
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    return [NSString stringWithFormat:@"%@.%@", bundleIdentifier, @"payments"];
}

#pragma mark - didFinishLaunchingWithOptions

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [Bugsnag start];

  // [START configure_firebase]
  [FIRApp configure];
  // [END configure_firebase]
  
  // Initialize CIO SDK
  [pnHandlerObj setupCustomerIOClickHandling:self];
  
  [FIRMessaging messaging].delegate = self;
  
  [BTAppContextSwitcher setReturnURLScheme:self.paymentsURLScheme];
  
  // react-native-encrypted-storage fix
  ClearKeychainIfNecessary();
  
  // Setup Braze
  NSLog(@"Braze API Key: %@", brazeApiKey);
  NSLog(@"Braze Endpoint: %@", brazeEndpoint);
  BRZConfiguration *configuration = [[BRZConfiguration alloc] initWithApiKey:brazeApiKey endpoint:brazeEndpoint];
  configuration.triggerMinimumTimeInterval = 1;
  configuration.logger.level = BRZLoggerLevelInfo;
  Braze *braze = [BrazeReactBridge initBraze:configuration];
  // braze.delegate = [[BrazeReactDelegate alloc] init];
  AppDelegate.braze = braze;
  
  // Braze Push Notifications
  [self registerForPushNotifications];
  [[BrazeReactUtils sharedInstance] populateInitialUrlFromLaunchOptions:launchOptions];
    
  NSLog(@"Launch Options: %@", launchOptions);
    
  // Deep link fix for push notifications
  // UIApplicationLaunchOptionsRemoteNotificationKey - key is used when your app is launched in response to a remote notification (push notification)
  // UIApplicationLaunchOptionsURLKey - key is used when your app is launched by opening a URL scheme (e.g., myapp://) from another app.
  NSMutableDictionary *modifiedLaunchOptions = [NSMutableDictionary dictionaryWithDictionary:launchOptions];
  if (launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey]) {
    NSDictionary *pushContent = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
    if (pushContent[@"react-deep-link"] || pushContent[@"ab_uri"]) {
      NSString *initialURL = pushContent[@"react-deep-link"] ? pushContent[@"react-deep-link"] : pushContent[@"ab_uri"];
      if (!launchOptions[UIApplicationLaunchOptionsURLKey]) {
        modifiedLaunchOptions[UIApplicationLaunchOptionsURLKey] = [NSURL URLWithString:initialURL];
      }
    }
  }
  

//  NSDictionary *initProps = [self prepareInitialProps];
//  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"tpcmobile", initProps);
//
//  if (@available(iOS 13.0, *)) {
//    rootView.backgroundColor = [[UIColor alloc] initWithRed:.49f green:.05f blue:.72f alpha:1];
//  } else {
//    rootView.backgroundColor = [UIColor whiteColor];
//  }
  self.moduleName = @"tpcmobile";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // return [super application:application didFinishLaunchingWithOptions:modifiedLaunchOptions];
  // Temporary workaround for RN 0.71
  BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];
  self.window.rootViewController.view.backgroundColor = [UIColor colorWithRed:.49f green:.05f blue:.72f alpha:1];
  return result;
}

#pragma mark - Push Notifications

// Braze IOS
- (void)registerForPushNotifications {
  UNUserNotificationCenter *center = UNUserNotificationCenter.currentNotificationCenter;
  [center setNotificationCategories:BRZNotifications.categories];
  center.delegate = self;
  [UIApplication.sharedApplication registerForRemoteNotifications];
  // Authorization is requested later in the JavaScript layer via `Braze.requestPushPermission`.
}

// Braze
// Tells the delegate that the app successfully registered with Apple Push Notification service (APNs).
- (void)application:(UIApplication *)application
  didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  const unsigned *tokenBytes = (const unsigned *)[deviceToken bytes];
  NSString *hexToken = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",
                       ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                       ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                       ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];

  NSLog(@"DEVICE APN TOKEN: %@", hexToken);
  [AppDelegate.braze.notifications registerDeviceToken:deviceToken];
}

// Braze
// Tells the app that a remote notification arrived that indicates there is data to be fetched.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  
  if (userInfo[@"ab"]) {
    BOOL processedByBraze = AppDelegate.braze != nil && [AppDelegate.braze.notifications handleBackgroundNotificationWithUserInfo:userInfo
                                                                                                           fetchCompletionHandler:completionHandler];
    if (processedByBraze) {
      return;
    }
  }

  completionHandler(UIBackgroundFetchResultNoData);
}


// CIO / Firebasse
/// This method will be called once a token is available, or has been refreshed. Typically it
/// will be called once per app start, but may be called more often, if token is invalidated or
/// updated. In this method, you should perform operations such as:
- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    NSLog(@"DEVICE FCM TOKEN: %@", fcmToken);
    [pnHandlerObj didReceiveRegistrationToken:messaging fcmToken: fcmToken];
}

// Braze + CIO
// Asks the delegate how to handle a notification that arrived while the app was running in the foreground.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  // Get the content of the received notification
  UNNotificationContent *notificationContent = notification.request.content;
  // Extract the user info of the notification
  NSDictionary *userInfo = notificationContent.userInfo;
  
  // CIO
  if (userInfo[@"CIO"]) {
    NSLog(@"Process CIO");
  }
  
  // Braze
  if (userInfo[@"ab"]) {
    NSLog(@"Process Braze");
  }

  // Braze
  if (@available(iOS 14.0, *)) {
    if (userInfo[@"aps"][@"mutable-content"]) {
      completionHandler(UNNotificationPresentationOptionList | UNNotificationPresentationOptionBanner);
    } else {
      completionHandler(UNNotificationPresentationOptionAlert);
    }
  } else {
    completionHandler(UNNotificationPresentationOptionAlert);
  }
}

// Braze + CIO
// Asks the delegate to process the user's response to a delivered notification.
// to send push metrics back
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler {
  // Get the content of the received notification
  UNNotificationContent *notificationContent = response.notification.request.content;
  // Extract the user info of the notification
  NSDictionary *userInfo = notificationContent.userInfo;
  
  if (userInfo[@"CIO"]) {
    // CIO
    [pnHandlerObj userNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
  }
  
  if (userInfo[@"ab"]) {
    // Braze
    [[BrazeReactUtils sharedInstance] populateInitialUrlForCategories:response.notification.request.content.userInfo];
    BOOL processedByBraze = AppDelegate.braze != nil && [AppDelegate.braze.notifications handleUserNotificationWithResponse:response
                                                                                                      withCompletionHandler:completionHandler];
    if (processedByBraze) {
      return;
    }

    completionHandler();
  }
}

#pragma mark - Linking

- (BOOL)application:(UIApplication *)application
  openURL:(NSURL *)url
  options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([url.scheme localizedCaseInsensitiveCompare:self.paymentsURLScheme] == NSOrderedSame) {
      return [BTAppContextSwitcher handleOpenURL:url];
  }
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}


#pragma mark - Helpers for Braze

+ (Braze *)braze {
  return _braze;
}

+ (void)setBraze:(Braze *)braze {
  _braze = braze;
}

#pragma mark - React Native methods


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  // return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  return [CodePush bundleURL];
#endif
}



@end
