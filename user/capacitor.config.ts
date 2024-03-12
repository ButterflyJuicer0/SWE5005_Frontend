import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.android.golden",
  appName: "goldenAndroid",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
