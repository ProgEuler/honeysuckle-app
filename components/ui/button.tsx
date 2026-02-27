import ArrowRight from '@/assets/svgs/arrowright.svg';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { RNText } from './input';

const RNButton = ({
  path,
  value,
  tag = 'push',
}: {
  path?: String;
  value: String;
  tag?: String;
}) => {
  // console.log(path);
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('tag:', tag);
        if (tag === 'push') {
          console.log('push the path');
          router.push(path);
        } else if (tag === 'replace') {
          console.log('replace the path');
          router.replace(path);
        }
      }}
      style={{
        backgroundColor: Colors.brown,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        gap: 15,
        borderRadius: 30,
      }}
    >
      <RNText variant="title" size="lg" style={{ color: Colors.white }}>
        {value}
      </RNText>
      <ArrowRight />
    </TouchableOpacity>
  );
};

export default RNButton;
