import AI from "@/assets/svgs/ai.svg";
import AIGreen from "@/assets/svgs/aig.svg";
import Back from "@/assets/svgs/back.svg";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Portal } from "react-native-portalize";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export const inspirationQuestions = [
    {
        id: 1,
        question:
            "What is the strongest feeling you're experiencing right now, and why do you think it showed up today?",
    },
    {
        id: 2,
        question:
            "Did something specific trigger your mood, or has it been building over time?",
    },
    {
        id: 3,
        question:
            "If you could talk to someone about how you feel, what would you want them to understand?",
    },
    {
        id: 4,
        question: "What is one thing today that made your mood better or worse?",
    },
    {
        id: 5,
        question:
            "What do you wish you could change about your day if you had the chance?",
    },
    {
        id: 6,
        question: "What thoughts keep repeating in your mind right now?",
    },
    {
        id: 7,
        question: "What is something you needed today but didn’t receive?",
    },
    {
        id: 8,
        question: "If your mood could speak, what message would it tell you?",
    },
    {
        id: 9,
        question: "What gave you comfort today, even if it was something small?",
    },
    {
        id: 10,
        question: "What is one thing you're proud of handling today?",
    },
];

const JournalEntry = () => {
    const { bottom } = useSafeAreaInsets();
    const [text, setText] = useState("");
    const [insparation, setInsparation] = useState(false);
    const [journal, setJournal] = useState("Write about your day...");

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                        paddingHorizontal: 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 20,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                padding: 12,
                                borderWidth: 1,
                                borderColor: Colors.brown,
                                alignItems: "flex-start",
                                borderRadius: 40,
                            }}
                        >
                            <Back />
                        </TouchableOpacity>
                        <RNText variant="title" size="xl">
                            Assessment
                        </RNText>
                    </View>
                    <View
                        style={{
                            backgroundColor: "#E8DDD9",
                            paddingHorizontal: 15,
                            paddingVertical: 8,
                            borderRadius: 30,
                        }}
                    >
                        <RNText variant="title" size="sm" style={{ color: "#926247" }}>
                            3 OF 3
                        </RNText>
                    </View>
                </View>
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        justifyContent: "center",
                        paddingTop: 60,
                        paddingBottom: bottom + 40,
                    }}
                >
                    <View
                        style={{
                            width: "90%",
                            marginHorizontal: "auto",
                        }}
                    >
                        <View style={{ gap: 50, marginBottom: 50 }}>
                            <View style={{ width: "90%", marginHorizontal: "auto" }}>
                                <RNText
                                    variant="header"
                                    size="3xl"
                                    style={{ textAlign: "center" }}
                                >
                                    Want to share what is on your mind?
                                </RNText>
                            </View>
                            <View>
                                <RNText variant="header" size="lg">
                                    Journal Entry
                                </RNText>
                                <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            borderRadius: 10,
                                            padding: 15,
                                            fontSize: 16,
                                            fontFamily: "Regular",
                                            backgroundColor: "#D3DCBD",
                                            height: 180,
                                        }}
                                        placeholder={"What feels most important right now?"}
                                        multiline={true}
                                        numberOfLines={6}
                                        value={text}
                                        onChangeText={setText}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => setInsparation(true)}
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                borderWidth: 1,
                                borderColor: Colors.green,
                                paddingVertical: 13,
                                borderRadius: 30,
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 30,
                            }}
                        >
                            <AI />
                            <RNText variant="subtitle" size="lg">
                                Need inspiration?
                            </RNText>
                        </TouchableOpacity>
                        <RNButton
                            value={"Save Entry"}
                            path={"/dailycheck-sub-screens/performance"}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </>
            {insparation && (
                <Portal>
                    <BlurView
                        intensity={30}
                        tint="dark"
                        experimentalBlurMethod="dimezisBlurView"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    height: "70%",
                                    width: "90%",
                                    marginHorizontal: "auto",
                                    marginVertical: "auto",
                                    backgroundColor: Colors.white,
                                    borderRadius: 20,
                                }}
                            >
                                <View
                                    style={{
                                        width: "85%",
                                        marginHorizontal: "auto",
                                        marginTop: 25,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                            <AIGreen />
                                            <RNText variant="header" size="lg" style={{}}>
                                                Writing Prompts
                                            </RNText>
                                        </View>
                                        <TouchableOpacity onPress={() => setInsparation(false)}>
                                            <X height={18} width={18} />
                                        </TouchableOpacity>
                                    </View>
                                    <RNText
                                        variant="base"
                                        size="md"
                                        style={{
                                            color: Colors.green,
                                            textAlign: "center",
                                            marginTop: 10,
                                            marginBottom: 25,
                                        }}
                                    >
                                        Choose a prompt to help you get started with your journal
                                        entry
                                    </RNText>
                                    <ScrollView style={{ height: "80%", paddingHorizontal: 5 }}>
                                        {inspirationQuestions.map((item) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setText((prev) => `${item.question}\n\n`);
                                                    setInsparation(false);
                                                }}
                                                key={item.id}
                                                style={{
                                                    borderColor: Colors.green,
                                                    padding: 10,
                                                    borderWidth: 1,
                                                    marginBottom: 15,
                                                    borderRadius: 15,
                                                }}
                                            >
                                                <RNText variant="base" size="md">
                                                    {item.question}
                                                </RNText>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </Portal>
            )}
        </SafeAreaView>
    );
};

export default JournalEntry;
