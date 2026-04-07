import Lock from "@/assets/svgs/lock.svg";
import InputForm from "@/components/inputform";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import React from "react";
import { useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const NewPassword = () => {
    const dummyForm = useForm();

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            bottomOffset={24}
        >
            <View style={styles.backgroundCircle} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require("@/assets/images/logo.png")}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.formWrapper}>
                    <View style={styles.titleGroup}>
                        <RNText variant="title" size="3xl" style={styles.titleText}>
                            Create New Password
                        </RNText>
                        <RNText variant="base" size="lg" style={styles.subtitleText}>
                            Your new password must be unique from those previously used.
                        </RNText>
                    </View>

                    <View style={styles.formGroup}>
                        <View style={styles.inputsGroup}>
                            <InputForm
                                title={"password"}
                                label={"Password"}
                                placeHolder={"Enter your password"}
                                control={dummyForm.control}
                                errors={{}}
                                Icon={Lock}
                            />
                            <InputForm
                                title={"confirmPassword"}
                                label={"Confirm Password"}
                                placeHolder={"Confirm Password"}
                                control={dummyForm.control}
                                errors={{}}
                                Icon={Lock}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonWrap}>
                        <RNButton path={"/auth"} value={"Save"} />
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
};

export default NewPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: 32,
    },
    backgroundCircle: {
        backgroundColor: Colors.green,
        width: 960,
        height: 960,
        position: "absolute",
        top: -750,
        left: "50%",
        marginLeft: -480,
        borderRadius: 1234,
    },
    safeArea: {
        flex: 1,
        gap: 80,
        marginTop: 20,
        justifyContent: "space-between",
    },
    logoContainer: {
        alignItems: "center",
    },
    logo: {
        height: 60,
        width: 60,
    },
    formWrapper: {
        width: "90%",
        marginHorizontal: "auto",
        alignSelf: "center",
        gap: 20,
    },
    titleGroup: {
        gap: 10,
    },
    titleText: {
        textAlign: "center",
    },
    subtitleText: {
        textAlign: "center",
        marginBottom: 20,
        width: "90%",
        marginHorizontal: "auto",
    },
    formGroup: {
        gap: 10,
    },
    inputsGroup: {
        gap: 20,
    },
    buttonWrap: {
        marginTop: 20,
    },
});
