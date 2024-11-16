import { Stack } from 'expo-router';
import { router } from 'expo-router';

export default function SearchStack() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}