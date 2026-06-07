package expo.modules.deviceinfo

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

/**
 * DeviceInfoRecord — Expo Module Record type
 *
 * A Record is expo-modules-core's answer to WritableNativeMap.
 * Each @Field property maps to a key in the JS object that JS receives.
 *
 * With the old bridge you wrote:
 *   val map = WritableNativeMap()
 *   map.putString("model", Build.MODEL)
 *   map.putInt("sdkVersion", Build.VERSION.SDK_INT)
 *   ...
 *   promise.resolve(map)
 *
 * Now you just return this data class from AsyncFunction — expo-modules-core
 * uses JSI to pass the struct across without any JSON serialization.
 */
class DeviceInfoRecord : Record {
  @Field var model: String = ""
  @Field var brand: String = ""
  @Field var osVersion: String = ""
  @Field var sdkVersion: Int = 0
  @Field var deviceId: String = ""
  @Field var manufacturer: String = ""

  constructor()

  constructor(
    model: String,
    brand: String,
    osVersion: String,
    sdkVersion: Int,
    deviceId: String,
    manufacturer: String
  ) {
    this.model        = model
    this.brand        = brand
    this.osVersion    = osVersion
    this.sdkVersion   = sdkVersion
    this.deviceId     = deviceId
    this.manufacturer = manufacturer
  }
}
