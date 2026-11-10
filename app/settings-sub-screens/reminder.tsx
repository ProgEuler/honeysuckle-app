import { Layout } from "@/components/layout/Layout";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { meQueryKey, useMeQuery } from "@/hooks/useMeQuery";
import { updateMe } from "@/lib/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BellRing, Clock } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { toast } from "sonner-native";

/** "21:30:00" → Date today at 21:30. */
const timeToDate = (value?: string) => {
  const [h = 9, m = 0] = (value ?? "09:00").split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date;
};

const dateToTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:00`;

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** Settings → Daily reminder: on/off and the time of the check-in reminder. */
const Reminder = () => {
  const { data: me } = useMeQuery();
  const queryClient = useQueryClient();
  const [pickerOpen, setPickerOpen] = useState(false);

  const enabled = me?.notify ?? false;
  const time = timeToDate(me?.checkin_time);

  const save = useMutation({
    mutationFn: updateMe,
    onSuccess: (updated) => {
      queryClient.setQueryData(meQueryKey, (old: typeof me) => (old ? { ...old, ...updated } : updated));
    },
    onError: () => toast.error("Couldn't save your reminder. Please try again."),
  });

  const handlePick = (date: Date) => {
    setPickerOpen(false);
    save.mutate(
      { notify: true, checkin_time: dateToTime(date) },
      { onSuccess: () => toast.success(`We'll remind you at ${formatTime(date)}.`) },
    );
  };

  return (
    <Layout edges={["top"]} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <BellRing size={20} color={Colors.green} />
          </View>
          <View style={{ flex: 1 }}>
            <RNText variant="header" size="md">Daily check-in reminder</RNText>
            <RNText variant="medium" size="sm" style={styles.muted}>
              A gentle nudge once a day. Skipped if you've already checked in.
            </RNText>
          </View>
          <Switch
            value={enabled}
            onValueChange={(notify) => save.mutate({ notify })}
            disabled={save.isPending || !me}
            trackColor={{ false: "#E0E0E0", true: Colors.green }}
            thumbColor={Colors.white}
            ios_backgroundColor="#E0E0E0"
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.row, !enabled && styles.disabled]}
          onPress={() => setPickerOpen(true)}
          disabled={!enabled || save.isPending}
          accessibilityRole="button"
          accessibilityHint="Changes when the reminder arrives"
        >
          <View style={styles.icon}>
            <Clock size={20} color={Colors.green} />
          </View>
          <RNText variant="header" size="md" style={{ flex: 1 }}>Reminder time</RNText>
          <RNText variant="title" size="lg" style={{ color: Colors.green }}>
            {formatTime(time)}
          </RNText>
        </TouchableOpacity>
      </View>

      <RNText variant="medium" size="xs" style={[styles.muted, styles.note]}>
        Reminders follow your phone's time zone. Push notifications need to be allowed for
        Honeysuckle Trail in your phone's settings.
      </RNText>

      <DateTimePickerModal
        isVisible={pickerOpen}
        mode="time"
        date={time}
        onConfirm={handlePick}
        onCancel={() => setPickerOpen(false)}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 64 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F2F5EB",
    alignItems: "center",
    justifyContent: "center",
  },
  muted: { color: Colors.primaryText, lineHeight: 19 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#E8DDD9" },
  disabled: { opacity: 0.4 },
  note: { marginTop: 14, paddingHorizontal: 4 },
});

export default Reminder;
