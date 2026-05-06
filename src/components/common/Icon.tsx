/**
 * Central icon component — wraps react-native-vector-icons/Feather.
 *
 * Usage:
 *   <Icon name="file-text" size={20} color={colors.primary} />
 *
 * All valid Feather icon names: https://feathericons.com
 */
import React from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

type Props = {
  name: string;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 22, color = '#0F172A' }: Props) {
  return <FeatherIcon name={name} size={size} color={color} />;
}
