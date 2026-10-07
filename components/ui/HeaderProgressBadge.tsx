import { RNText } from "@/components/ui/input";
import { StyleSheet, View } from "react-native";

type HeaderProgressBadgeProps = {
    text: string;
};

/**
 * Brown-pill progress badge rendered inside a `<Stack>` native header's
 * `headerRight` slot (e.g. "1 OF 3", "3 OF 3" on the Daily Check-in flow).
 *
 * Lives outside the header component so the native navigation bar
 * keeps its iOS liquid-glass appearance — only this small element
 * is custom JSX.
 */
export const HeaderProgressBadge = ({ text }: HeaderProgressBadgeProps) => (
    <View style={styles.badge}>
        <RNText variant="title" size="sm" style={styles.text}>
            {text}
        </RNText>
    </View>
);

const styles = StyleSheet.create({
    badge: {
        backgroundColor: "#E8DDD9",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 30,
        marginRight: 4,
    },
    text: {
        color: "#926247",
    },
});

export default HeaderProgressBadge;
