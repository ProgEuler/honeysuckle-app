import Apple from "@/assets/svgs/apple.svg";
import Email from "@/assets/svgs/email.svg";
import Google from "@/assets/svgs/google.svg";
import Lock from "@/assets/svgs/lock.svg";
import InputForm from "@/components/inputform";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import useSocialAuth from "@/hooks/useSocialAuth";
// import { useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const dummyForm = useForm();

//   const { handleSocialAuth, loadingStrategy } = useSocialAuth();
//   const { signIn, setActive } = useSignIn();

//   const isLoading = loadingStrategy !== null;

//     const onSignInPress = useCallback(async () => {
//     if (!isLoaded) return

//     // Start the sign-in process using the email and password provided
//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//       })

//       // If sign-in process is complete, set the created session as active
//       // and redirect the user
//       if (signInAttempt.status === 'complete') {
//         await setActive({
//           session: signInAttempt.createdSessionId,
//           navigate: async ({ session }) => {
//             if (session?.currentTask) {
//               // Handle pending session tasks
//               // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
//               console.log(session?.currentTask)
//               return
//             }

//             router.replace('/')
//           },
//         })
//       } else if (signInAttempt.status === 'needs_second_factor') {
//         // Check if email_code is a valid second factor
//         // This is required when Client Trust is enabled and the user
//         // is signing in from a new device.
//         // See https://clerk.com/docs/guides/secure/client-trust
//         const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
//           (factor): factor is EmailCodeFactor => factor.strategy === 'email_code',
//         )

//         if (emailCodeFactor) {
//           await signIn.prepareSecondFactor({
//             strategy: 'email_code',
//             emailAddressId: emailCodeFactor.emailAddressId,
//           })
//           setShowEmailCode(true)
//         }
//       } else {
//         // If the status is not complete, check why. User may need to
//         // complete further steps.
//         console.error(JSON.stringify(signInAttempt, null, 2))
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/guides/development/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2))
//     }
//   } )
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: Colors.green,
          width: 960,
          height: 960,
          position: "absolute",
          top: -750,
          left: "50%",
          marginLeft: -480,
          borderRadius: 1234,
        }}
      />
      <SafeAreaView style={{ flex: 1, gap: 120, marginTop: 30 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ height: 60, width: 60 }}
          />
        </View>
        <View
          style={{
            width: "90%",
            marginHorizontal: "auto",
            alignSelf: "center",
            gap: 30,
          }}
        >
          <RNText
            variant="title"
            size="3xl"
            style={{ textAlign: "center", marginBottom: 20 }}
          >
            Sign in to Honeysuckle Trail
          </RNText>
          <View style={{ gap: 10 }}>
            <View style={{ gap: 20 }}>
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
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                style={{ margin: 8, borderRadius: 10 }}
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? Colors.green : Colors.green}
              />
              <RNText variant="medium">
                I Agree with the{' '}
                <RNText
                  variant="medium"
                  style={{
                    color: Colors.green,
                    textDecorationLine: 'underline',
                  }}
                >
                  Tearms & Conditions
                </RNText>
              </RNText>
            </View> */}
          </View>
          <View>
            <RNButton path={"/onboarding"} value={"Sign In"} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 30,
              marginVertical: 10,
            }}
          >
            <TouchableOpacity
              style={{
                height: 56,
                width: 56,
                backgroundColor: "#E8DDD9",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 40,
              }}
            //   onPress={() => !isLoading && handleSocialAuth("oauth_google")}
            >
              <Google />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 56,
                width: 56,
                backgroundColor: "#E8DDD9",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 40,
              }}
            //   onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
            >
              <Apple />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RNText variant="medium" size="lg">
              {" "}
              Already have an account?{" "}
            </RNText>
            <TouchableOpacity
              onPress={() => router.replace("/auth/signup")}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <RNText
                variant="medium"
                size="lg"
                style={{
                  color: Colors.orange,
                  textDecorationLine: "underline",
                }}
              >
                Sign Up.
              </RNText>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot")}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <RNText
                variant="medium"
                size="lg"
                style={{
                  color: Colors.orange,
                  textDecorationLine: "underline",
                }}
              >
                Forgot Password ?
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default index;
