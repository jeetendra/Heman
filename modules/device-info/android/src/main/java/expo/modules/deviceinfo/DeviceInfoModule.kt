package expo.modules.deviceinfo

import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DeviceInfoModule : Module() {

  override fun definition() = ModuleDefinition {

    Name("DeviceInfo")

    // ── Synchronous constants ─────────────────────────────────────────────────
    // Constants{} block — these become properties on the JS module object.
    // Evaluated once at module initialisation.
    Constants {
      mapOf(
        "DEVICE_NAME" to Build.MODEL,
        "OS_VERSION"  to Build.VERSION.RELEASE
      )
    }

    // ── AsyncFunction: getBatteryLevel ────────────────────────────────────────
    AsyncFunction("getBatteryLevel") {
      val intentFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
      val batteryStatus: Intent =
        appContext.reactContext?.registerReceiver(null, intentFilter)
          ?: throw Exception("Could not access battery status")

      val level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
      val scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1)

      if (level == -1 || scale == -1) throw Exception("Could not read battery level")

      (level.toFloat() / scale.toFloat() * 100).toInt()
    }

    // ── AsyncFunction: isCharging ─────────────────────────────────────────────
    AsyncFunction("isCharging") {
      val intentFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
      val batteryStatus: Intent =
        appContext.reactContext?.registerReceiver(null, intentFilter)
          ?: throw Exception("Could not access battery status")

      val status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
      status == BatteryManager.BATTERY_STATUS_CHARGING ||
        status == BatteryManager.BATTERY_STATUS_FULL
    }

    // ── AsyncFunction: getDeviceInfo ──────────────────────────────────────────
    AsyncFunction("getDeviceInfo") {
      DeviceInfoRecord(
        model        = Build.MODEL,
        brand        = Build.BRAND,
        osVersion    = Build.VERSION.RELEASE,
        sdkVersion   = Build.VERSION.SDK_INT,
        deviceId     = Build.ID,
        manufacturer = Build.MANUFACTURER
      )
    }
  }
}
