import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { inspirationQuestions } from "@/constants/prompt-inspirations";
import { Plus, X } from "lucide-react-native";
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (prompt: string) => void;
};

/** Bottom sheet of writing prompts for the journal entry. */
export default function InspirationSheet({ visible, onClose, onPick }: Props) {
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Tap outside the sheet to close. */}
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close prompts" />

        <View style={[styles.sheet, { paddingBottom: Math.max(bottom, 16) }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={{ flex: 1, gap: 2 }}>
              <RNText variant="title" size="xl">
                Need a starting point?
              </RNText>
              <RNText variant="medium" size="sm" style={styles.muted}>
                Tap a prompt to add it to your entry.
              </RNText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.close}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Close prompts"
            >
              <X size={18} color={Colors.brown} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {inspirationQuestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => onPick(item.question)}
                style={styles.prompt}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityHint="Adds this prompt to your journal entry"
              >
                <RNText variant="medium" size="md" style={styles.promptText}>
                  {item.question}
                </RNText>
                <View style={styles.plus}>
                  <Plus size={16} color={Colors.green} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    maxHeight: "80%",
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D9CFC9",
    marginBottom: 14,
  },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 },
  muted: { color: Colors.primaryText },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFE8E5",
    alignItems: "center",
    justifyContent: "center",
  },
  list: { flexGrow: 0 },
  listContent: { gap: 10, paddingBottom: 8 },
  prompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },
  promptText: { flex: 1, color: Colors.brown, lineHeight: 22 },
  plus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F2F5EB",
    alignItems: "center",
    justifyContent: "center",
  },
});
