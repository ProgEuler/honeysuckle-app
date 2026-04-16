import * as ExpoImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

type Size = {
  width: number;
  height: number;
};

type ImageSource = "gallery" | "camera";

type ImagePickerOptions = {
  source?: ImageSource;
  promptSourceSelection?: boolean;
};

const askLibraryPermission = async () => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted) {
    return true;
  }

  if (!permissionResult.canAskAgain) {
    Alert.alert(
      "Permission Required",
      "Photo library permission is blocked. Please enable it from Settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: async () => {
            await Linking.openSettings();
          },
        },
      ],
    );
    return false;
  }

  Alert.alert(
    "Permission Required",
    "Permission to access gallery is required.",
  );
  return false;
};

const askCameraPermission = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (permissionResult.granted) {
    return true;
  }

  if (!permissionResult.canAskAgain) {
    Alert.alert(
      "Permission Required",
      "Camera permission is blocked. Please enable it from Settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: async () => {
            await Linking.openSettings();
          },
        },
      ],
    );
    return false;
  }

  Alert.alert(
    "Permission Required",
    "Permission to access camera is required.",
  );
  return false;
};

const pickImageBySource = async (source: ImageSource, multi?: boolean) => {
  if (source === "camera") {
    return ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  }

  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: multi ? true : false,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
};

const chooseSource = async (): Promise<ImageSource | null> => {
  return new Promise((resolve) => {
    Alert.alert("Select Photo", "Choose image source", [
      {
        text: "Camera",
        onPress: () => resolve("camera"),
      },
      {
        text: "Gallery",
        onPress: () => resolve("gallery"),
      },
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => resolve(null),
      },
    ]);
  });
};

export async function imagePicker(
  cb: (uri: string | null) => void,
  size?: Size,
  multi?: boolean,
  options?: ImagePickerOptions,
) {
  let source: ImageSource = options?.source ?? "gallery";

  if (options?.promptSourceSelection) {
    const chosenSource = await chooseSource();
    if (!chosenSource) {
      cb(null);
      return;
    }
    source = chosenSource;
  }

  const hasPermission =
    source === "camera"
      ? await askCameraPermission()
      : await askLibraryPermission();

  if (!hasPermission) {
    cb(null);
    return;
  }

  const result = await pickImageBySource(source, multi);

  if (!result.canceled) {
    const context = ExpoImageManipulator.ImageManipulator.manipulate(
      result.assets[0].uri,
    );

    context.resize({
      width: size?.width || 200,
      height: size?.height || 200,
    });

    const renderedImage = await context.renderAsync();

    const res = await renderedImage.saveAsync({
      format: ExpoImageManipulator.SaveFormat.PNG,
    });

    cb(res.uri);
  } else {
    cb(null);
  }
}
