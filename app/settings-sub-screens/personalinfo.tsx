import Calender from "@/assets/svgs/calender.svg";
import Edit from "@/assets/svgs/edit.svg";
import Location from "@/assets/svgs/location.svg";
import Person from "@/assets/svgs/person.svg";
import DatePicker, { DatePickerRef } from "@/components/datepicker";
import InputForm from "@/components/inputform";
import { Layout } from "@/components/layout/Layout";
import PersonalInfoSkeleton from "@/components/skeletons/screens/PersonalInfoSkeleton";
import HeaderBack from "@/components/ui/HeaderBack";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { meQueryKey, useMeQuery } from "@/hooks/useMeQuery";
import { updateMe } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useUserStore } from "@/store/useUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";

type PersonalInfoForm = {
  fullName: string;
  gender: string;
  location: string;
  dateOfBirth: Date | null;
};

const genderOptions = ["male", "female", "transgender"] as const;

const isGenderOption = (
  value: string,
): value is (typeof genderOptions)[number] =>
  genderOptions.includes(value as (typeof genderOptions)[number]);

const formatGenderLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const PersonalInfo = () => {
  const queryClient = useQueryClient();
  const { hasSoughtProfessionalHelp, setHasSoughtProfessionalHelp } =
    useUserStore();
  const { data: me, isLoading: meLoading, refetch: refetchMe, isRefetching } = useMeQuery();
  console.log(me)
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedImageMimeType, setSelectedImageMimeType] = useState<
    string | null
  >(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null,
  );
  const { control, handleSubmit, reset } = useForm<PersonalInfoForm>({
    defaultValues: {
      fullName: "",
      gender: "",
      location: "",
      dateOfBirth: null,
    },
  });
  const datePickRef = useRef<DatePickerRef>(null);

  const updateProfileMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async (updatedProfile) => {
      queryClient.setQueryData(meQueryKey, updatedProfile);
      await refetchMe();
      toast.success("Profile updated successfully.");
      router.back();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unable to update profile right now.";

      toast.error(message);
    },
  });

  useEffect(() => {
    const dobValue = me?.dob ? new Date(me.dob) : null;
    const normalizedGender = me?.gender?.toLowerCase() ?? "";

    reset({
      fullName: me?.name || "",
      gender: isGenderOption(normalizedGender) ? normalizedGender : "",
      location: me?.location || "",
      dateOfBirth:
        dobValue && !Number.isNaN(dobValue.getTime()) ? dobValue : null,
    });
  }, [me, reset]);

  const onSubmit = (values: PersonalInfoForm) => {
    const normalizedGender = values.gender.toLowerCase().trim();

    const payload = {
      name: values.fullName.trim(),
      gender: isGenderOption(normalizedGender) ? normalizedGender : null,
      location: values.location.trim() || null,
      dob: values.dateOfBirth
        ? values.dateOfBirth.toISOString().split("T")[0]
        : null,
    };

    if (!selectedImageUri) {
      updateProfileMutation.mutate(payload);
      return;
    }

    const imageType = selectedImageMimeType || "image/jpeg";
    const imageName =
      selectedImageName ||
      `profile_${Date.now()}.${imageType.includes("png") ? "png" : "jpg"}`;

    const formData = new FormData();
    formData.append("name", payload.name);

    if (payload.gender) {
      formData.append("gender", payload.gender);
    }

    if (payload.location) {
      formData.append("location", payload.location);
    }

    if (payload.dob) {
      formData.append("dob", payload.dob);
    }

    formData.append("image", {
      uri: selectedImageUri,
      name: imageName,
      type: imageType,
    } as any);

    updateProfileMutation.mutate(formData);
  };

  const handlePickImage = async () => {
    if (updateProfileMutation.isPending) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      toast.error("Media library permission is required to pick an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    setSelectedImageUri(asset.uri);
    setSelectedImageMimeType(asset.mimeType || null);
    setSelectedImageName(asset.fileName || null);
  };

  // First-load skeleton: shown only when there's no cached `me` to render.
  if (meLoading && !me) {
    return (
      <>
        <HeaderBack title="Edit Personal Info" />
        <Layout edges={[]}>
          <PersonalInfoSkeleton />
        </Layout>
      </>
    );
  }

  return (
    <>
      <HeaderBack title="Edit Personal Info" />
      <Layout edges={[]} 
                refreshControl={
                  <RefreshControl refreshing={isRefetching} onRefresh={refetchMe} colors={[Colors.green]} tintColor={Colors.green} />
                }
      >
        <View style={styles.mainContent}>
          <View>
            <View style={styles.profileImageFrame}>
              <Image
                source={
                  selectedImageUri
                    ? { uri: selectedImageUri }
                    : me?.image
                      ? { uri: me.image }
                      : require("@/assets/images/avatar-fallback.png")
                }
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handlePickImage}
              disabled={updateProfileMutation.isPending}
            >
              <Edit />
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <InputForm
              title={"fullName"}
              label={"Full Name"}
              placeHolder={"Enter your full name"}
              control={control}
              errors={{}}
              Icon={Person}
            />

            <View style={styles.dateFieldSection}>
              <RNText variant="header" size="sm" style={styles.dateFieldLabel}>
                Date of Birth
              </RNText>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, value } }) => (
                  <>
                    <DatePicker ref={datePickRef} onChange={onChange} />
                    <TouchableOpacity
                      onPress={() => {
                        datePickRef.current?.showDatePicker();
                      }}
                      style={styles.dateInputWrap}
                    >
                      <Calender />
                      <TextInput
                        placeholder="Select Date"
                        value={value ? (value as Date).toDateString() : ""}
                        editable={false}
                        pointerEvents="none"
                        placeholderTextColor="#999"
                        style={styles.dateInput}
                      />
                    </TouchableOpacity>
                  </>
                )}
              />
            </View>

            <View style={styles.genderSection}>
              <RNText variant="header" size="sm" style={styles.dateFieldLabel}>
                Gender
              </RNText>
              <Controller
                control={control}
                name="gender"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.genderOptionsRow}>
                    {genderOptions.map((option) => {
                      const isSelected = value === option;

                      return (
                        <TouchableOpacity
                          key={option}
                          onPress={() => onChange(option)}
                          style={[
                            styles.genderOption,
                            isSelected && styles.genderOptionSelected,
                          ]}
                        >
                          <RNText
                            variant="medium"
                            size="md"
                            style={[
                              styles.genderOptionText,
                              isSelected && styles.genderOptionTextSelected,
                            ]}
                          >
                            {formatGenderLabel(option)}
                          </RNText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </View>

            <InputForm
              title={"location"}
              label={"Location"}
              placeHolder={"Enter the location"}
              control={control}
              errors={{}}
              Icon={Location}
            />

            <View style={styles.additionalInfoSection}>
              <RNText variant="header" size="md">
                Additional Information
              </RNText>

              {/* <View style={styles.metaRow}>
                <RNText variant="medium" size="md" style={styles.metaLabel}>
                  Sought professional help before?
                </RNText>
                <TouchableOpacity
                  onPress={() =>
                    setHasSoughtProfessionalHelp(!hasSoughtProfessionalHelp)
                  }
                >
                  <RNText variant="medium" size="md" style={styles.metaValue}>
                    {hasSoughtProfessionalHelp ? "Yes" : "No"}
                  </RNText>
                </TouchableOpacity>
              </View> */}

              <View style={styles.metaRow}>
                <RNText variant="medium" size="md" style={styles.metaLabel}>
                  Email
                </RNText>
                <RNText variant="medium" size="md" style={styles.metaValue}>
                  {me?.email || "-"}
                </RNText>
              </View>

              <View style={styles.metaRow}>
                <RNText variant="medium" size="md" style={styles.metaLabel}>
                  Total Check-ins
                </RNText>
                <RNText variant="medium" size="md" style={styles.metaValue}>
                  {typeof me?.total_checkin === "number" ? me.total_checkin : 0}
                </RNText>
              </View>

              <View style={styles.metaRow}>
                <RNText variant="medium" size="md" style={styles.metaLabel}>
                  Streak
                </RNText>
                <RNText variant="medium" size="md" style={styles.metaValue}>
                  {typeof me?.streak === "number" ? me.streak : 0}
                </RNText>
              </View>
            </View>
          </View>

          <View style={styles.submitWrap}>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={updateProfileMutation.isPending}
              style={styles.submitButton}
            >
              <RNText variant="header" size="lg" style={styles.submitText}>
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
        {/* </KeyboardAwareScrollView> */}
      </Layout>
    </>
  );
};

export default PersonalInfo;

const styles = StyleSheet.create({
  mainContent: {
    width: "100%",
    marginHorizontal: "auto",
    //  flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 30,
    //  marginTop: 20,
  },
  profileImageFrame: {
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 150,
    overflow: "hidden",
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 150,
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  formSection: {
    width: "100%",
    gap: 10,
  },
  dateFieldSection: {
    marginBottom: 10,
  },
  dateFieldLabel: {
    fontSize: 20,
    marginBottom: 12,
  },
  dateInputWrap: {
    flexDirection: "row",
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: Colors.green,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    fontFamily: "PoppinsRegular",
    backgroundColor: Colors.white,
    color: Colors.brown,
  },
  genderSection: {
    marginBottom: 10,
  },
  genderOptionsRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  genderOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.brown,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  genderOptionSelected: {
    backgroundColor: Colors.brown,
  },
  genderOptionText: {
    color: Colors.brown,
  },
  genderOptionTextSelected: {
    color: Colors.white,
  },
  additionalInfoSection: {
    marginTop: 20,
    gap: 15,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E7E1DD",
    borderRadius: 16,
  },
  metaLabel: {
    color: Colors.primaryText,
  },
  metaValue: {
    color: Colors.brown,
  },
  submitWrap: {
    width: "100%",
    //  marginBottom: 40,
  },
  submitButton: {
    backgroundColor: Colors.brown,
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: Colors.white,
  },
});
