/**
 * Smoke test keeps Jest wired without dragging the navigation tree into RN Jest mocks.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';

test('renders trivial tree', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<Text>SwiftDocs harness</Text>);
  });
});
