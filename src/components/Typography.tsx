import {
  Text as NativeText,
  TextInput as NativeTextInput,
  TextInputProps,
  TextProps,
} from "react-native";

import { fontFamily } from "../theme/typography";

export function Text({ style, ...props }: TextProps) {
  return (
    <NativeText
      {...props}
      style={[{ fontFamily: fontFamily.regular }, style]}
    />
  );
}

export function TextInput({ style, ...props }: TextInputProps) {
  return (
    <NativeTextInput
      {...props}
      style={[{ fontFamily: fontFamily.regular }, style]}
    />
  );
}
