import { RNText } from "@/components/ui/input";
import type { AssessmentAnswerValue, AssessmentQuestion } from "@/lib/api/assessment";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  question: AssessmentQuestion;
  value: AssessmentAnswerValue | undefined;
  onChange: (value: AssessmentAnswerValue) => void;
};

export default function AssessmentQuestionField({ question, value, onChange }: Props) {
  const isMultiple = question.question_type === "multiple_choice";
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (label: string) => {
    if (!isMultiple) {
      onChange(selected[0] === label ? "" : label);
      return;
    }
    onChange(
      selected.includes(label)
        ? selected.filter((item) => item !== label)
        : [...selected, label],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <RNText variant="header" size="3xl" style={styles.titleText}>
          {question.text}
        </RNText>
        {!!question.help_text && (
          <RNText variant="medium" size="sm" style={styles.helpText}>
            {question.help_text}
          </RNText>
        )}
        {(isMultiple || !question.is_required) && (
          <RNText variant="medium" size="sm" style={styles.helpText}>
            {[isMultiple && "Select all that apply", !question.is_required && "Optional"]
              .filter(Boolean)
              .join(" · ")}
          </RNText>
        )}
      </View>

      {question.question_type === "text" ? (
        <TextInput
          style={styles.textInput}
          placeholder="Type your answer"
          placeholderTextColor="#8F8985"
          multiline
          maxLength={1000}
          value={typeof value === "string" ? value : ""}
          onChangeText={onChange}
          textAlignVertical="top"
        />
      ) : (
        <View style={styles.tagsContainer}>
          {question.options.map((option) => {
            const isActive = selected.includes(option.label);
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.label)}
                style={[styles.tag, isActive && styles.tagActive]}
                accessibilityRole={isMultiple ? "checkbox" : "radio"}
                accessibilityState={{ checked: isActive }}
              >
                <RNText
                  variant="medium"
                  size="sm"
                  style={[styles.tagText, isActive && styles.tagTextActive]}
                >
                  {option.label}
                </RNText>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  titleContainer: {
    width: "90%",
    marginHorizontal: "auto",
    gap: 6,
  },
  titleText: {
    textAlign: "center",
  },
  helpText: {
    textAlign: "center",
    color: "#8F8985",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  tag: {
    borderWidth: 1,
    borderColor: "#9BB068",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tagActive: {
    backgroundColor: "#CFD9B5",
  },
  tagText: {
    color: "#8F8985",
  },
  tagTextActive: {
    color: "#5B6B2F",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: "Regular",
    backgroundColor: "#FFFFFF",
    minHeight: 100,
  },
});
