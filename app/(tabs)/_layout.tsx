import CustomTabBar from "@/components/custometabbar";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
            backBehavior="history"
            tabBar={(props) => <CustomTabBar {...props} />}
        />
    );
};

export default TabsLayout;
