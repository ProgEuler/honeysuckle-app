import { Colors } from "@/constants/color";
import { ComponentType, ReactNode } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { RNText } from "./ui/input";

type Props<T extends FieldValues> = {
  title: Path<T>;
  label: string;
  placeHolder: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  keyboardType?: "default" | "email-address" | "numeric" | "number-pad";
  autoCapitalize?: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  Icon?: ComponentType;
  rightElement?: ReactNode;
};

const InputForm = <T extends FieldValues>({
  title,
  label,
  placeHolder,
  control,
  errors,
  keyboardType = "default",
  autoCapitalize = "words",
  secureTextEntry = false,
  rules,
  Icon,
  rightElement,
}: Props<T>) => {
  const rawError = errors[title]?.message;
  const errorMessage = typeof rawError === "string" ? rawError : null;

  return (
    <View style={{ marginBottom: 10, width: "100%" }}>
      <RNText
        variant="header"
        size="sm"
        style={{ fontSize: 18, marginBottom: 12 }}
      >
        {label}
      </RNText>
      <Controller
        control={control}
        name={title}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <>
            <View style={styles.inputContainer}>
              {Icon ? <Icon /> : null}
              <TextInput
                placeholder={placeHolder}
                value={value == null ? "" : String(value)}
                onChangeText={onChange}
                placeholderTextColor={Colors.primaryText}
                autoCorrect={false}
                autoCapitalize={autoCapitalize}
                spellCheck={false}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={styles.input}
              />
              {rightElement ? (
                <View style={styles.rightElementWrap}>{rightElement}</View>
              ) : null}
            </View>
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
          </>
        )}
      />
    </View>
  );
};

export default InputForm;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    fontFamily: "PoppinsRegular",
    backgroundColor: Colors.white,
    color: Colors.brown,
  },
  rightElementWrap: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    marginTop: 6,
    marginLeft: 6,
  },
});
