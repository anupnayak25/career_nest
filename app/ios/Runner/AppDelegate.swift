import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func applicationDidEnterBackground(_ application: UIApplication) {
      // Add a blur effect to disable screenshots
      let blurEffect = UIBlurEffect(style: .light)
      let blurEffectView = UIVisualEffectView(effect: blurEffect)
      blurEffectView.frame = window?.frame ?? CGRect.zero
      blurEffectView.tag = 1234
      window?.addSubview(blurEffectView)
  }

  func applicationWillEnterForeground(_ application: UIApplication) {
      // Remove the blur effect when app enters foreground
      window?.viewWithTag(1234)?.removeFromSuperview()
  }
}
