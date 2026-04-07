import Apple from "@/assets/svgs/apple.svg";
import Email from "@/assets/svgs/email.svg";
import Google from "@/assets/svgs/google.svg";
import Lock from "@/assets/svgs/lock.svg";
import InputForm from "@/components/inputform";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import Checkbox from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
    const dummyForm = useForm();
    const [isChecked, setChecked] = useState(false);
    const { acceptedTerms } = useLocalSearchParams<{ acceptedTerms?: string }>();

    useEffect(() => {
        if (acceptedTerms === "1") {
            setChecked(true);
        }
    }, [acceptedTerms]);

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
                    <RNText variant="title" size="3xl" style={styles.title}>
                        Sign Up For Free
                    </RNText>

                    <View style={styles.formGroup}>
                        <View style={styles.inputsGroup}>
                            <InputForm
                                title={"email"}
                                label={"Email Address"}
                                placeHolder={"abc@email.com"}
                                control={dummyForm.control}
                                errors={{}}
                                Icon={Email}
                            />
                            <InputForm
                                title={"password"}
                                label={"Password"}
                                placeHolder={"Enter your password"}
                                control={dummyForm.control}
                                errors={{}}
                                Icon={Lock}
                            />
                        </View>

                        <View style={styles.termsRow}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={setChecked}
                                color={Colors.green}
                            />
                            <RNText variant="medium">I Agree with the</RNText>
                            <TouchableOpacity
                                onPress={() => router.push("/auth/terms")}
                                style={styles.inlineLinkWrap}
                            >
                                <RNText variant="medium" style={styles.termsLink}>
                                    Terms & Conditions
                                </RNText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <RNButton path={"/auth/otp"} value={"Sign Up"} />

                    <View style={styles.socialButtonsRow}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Google />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Apple />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.centerRow}>
                        <RNText variant="medium" size="lg">
                            {" "}
                            Already have an account?{" "}
                        </RNText>
                        <TouchableOpacity
                            onPress={() => router.replace("/auth")}
                            style={styles.centerAlign}
                        >
                            <RNText variant="medium" size="lg" style={styles.linkText}>
                                Sign In.
                            </RNText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
};

export default SignUp;

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
        gap: 30,
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
    },
    formGroup: {
        gap: 10,
    },
    inputsGroup: {
        gap: 20,
    },
    termsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        margin: 8,
        borderRadius: 10,
    },
    termsLink: {
        color: Colors.green,
        textDecorationLine: "underline",
    },
    inlineLinkWrap: {
        alignSelf: "center",
    },
    socialButtonsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        marginVertical: 10,
    },
    socialButton: {
        height: 56,
        width: 56,
        backgroundColor: "#E8DDD9",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
    },
    centerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    centerAlign: {
        alignItems: "center",
        justifyContent: "center",
    },
    linkText: {
        color: Colors.orange,
        textDecorationLine: "underline",
    },
});
