import Foundation
import UserNotifications
import CioMessagingPushFCM
import CioTracking

enum PushProvider {
    case NotIdentified
    case Braze
    case CIO
}

let BrazeAPNSDictionaryKey = "ab"
let BrazeAPNSDictionaryAttachmentKey = "att"
let BrazeAPNSDictionaryAttachmentURLKey = "url"
let BrazeAPNSDictionaryAttachmentTypeKey = "type"

@objc
public class TpcNotificationServicePushHandler : NSObject {
  
  var pushProvider: PushProvider = .NotIdentified
  
  var bestAttemptContent: UNMutableNotificationContent?
  var contentHandler: ((UNNotificationContent) -> Void)?
  var originalContent: UNMutableNotificationContent?
  var abortOnAttachmentFailure: Bool = false
  
  public override init() {}
  
  @objc(didReceive:withContentHandler:)
  public func didReceive(_ request: UNNotificationRequest, withContentHandler handler: @escaping (UNNotificationContent) -> Void) {
    
    contentHandler = handler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    originalContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    
    // Access the user info dictionary from the notification request
    let userInfo = request.content.userInfo
    
    if (userInfo["ab"] != nil) {
      pushProvider = .Braze

      print("[BRAZE] Push with mutable content received.")
        
      guard let brazePayload = request.content.userInfo[BrazeAPNSDictionaryKey] as? [AnyHashable : Any] else { return displayOriginalContent("Push is not from Braze.") }
      guard let attachmentPayload = brazePayload[BrazeAPNSDictionaryAttachmentKey] as? [AnyHashable : Any] else { return displayOriginalContent("Push has no attachment.") }
      guard let attachmentURLString = attachmentPayload[BrazeAPNSDictionaryAttachmentURLKey] as? String else { return displayOriginalContent("Push has no attachment.") }
      guard let attachmentURL = URL(string: attachmentURLString) else { return displayOriginalContent("Cannot parse \(attachmentURLString) to URL.") }
      
      print("[BRAZE] Attachment URL string is \(attachmentURLString)")
      guard let attachmentType = attachmentPayload[BrazeAPNSDictionaryAttachmentTypeKey] as? String else { return displayOriginalContent("Push attachment has no type.") }
      
      print("[BRAZE] Attachment type is \(attachmentType)")
      let fileSuffix: String = ".\(attachmentType)"
      
      // Download, store, and attach the content to the notification
      let session = URLSession(configuration: URLSessionConfiguration.default)
      session.downloadTask(
        with: attachmentURL,
        completionHandler: { (temporaryFileLocation, response, error) in
          
        guard let temporaryFileLocation = temporaryFileLocation, error == nil else {
          return self.displayOriginalContent("Error fetching attachment, displaying content unaltered: \(String(describing: error?.localizedDescription))")
        }
          
        print("[BRAZE] Data fetched from server, processing with temporary file url \(temporaryFileLocation.absoluteString)")
        let typedAttachmentURL = URL(fileURLWithPath:"\(temporaryFileLocation.path)\(fileSuffix)")
          
        do {
          try FileManager.default.moveItem(at: temporaryFileLocation, to: typedAttachmentURL)
        }
        catch {
          return self.displayOriginalContent("Failed to move file path.")
        }
          
        guard let attachment = try? UNNotificationAttachment(identifier: "", url: typedAttachmentURL, options: nil) else { return self.displayOriginalContent("Attachment returned error.") }
          
        guard let bestAttemptContent = self.bestAttemptContent else { return self.displayOriginalContent("bestAttemptContent is nil") }
          
        bestAttemptContent.attachments = [attachment];
        handler(bestAttemptContent);
        }).resume()
      
    }
    
    if (userInfo["CIO"] != nil) {
      pushProvider = .CIO
      
      
      let siteId = ReactNativeConfig.env(for: "CUSTOMERIO_SITEID")
      let apiKey = ReactNativeConfig.env(for: "CUSTOMERIO_APIKEY")
      // let organizationId = ReactNativeConfig.env(for: "CUSTOMERIO_ORG")
      
      // You may choose to configure the SDK here
      // Update region to .EU for your EU-based workspace
      CustomerIO.initialize(siteId: siteId!, apiKey: apiKey!, region: .US) { config in
        config.autoTrackDeviceAttributes = true
        config.logLevel = .info
      }
      
      MessagingPush.shared.didReceive(request, withContentHandler: handler)
    }
    

    
  }
  
  func displayOriginalContent(_ extraLogging: String) {
    print("[BRAZE] \(extraLogging)")
    print("[BRAZE] Displaying original content.")
      
    guard let contentHandler = contentHandler, let originalContent = originalContent else { return }
    
    contentHandler(originalContent)
  }
  
  @objc(serviceExtensionTimeWillExpire)
  public func serviceExtensionTimeWillExpire() {
    if (pushProvider == .CIO) {
      MessagingPush.shared.serviceExtensionTimeWillExpire()
    }
    if (pushProvider == .Braze) {
      // Braze
      // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
      displayOriginalContent("Service extension called, displaying original content.")
    }

  }
}
