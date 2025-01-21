import { Stack } from 'expo-router/stack';

export default function FollowingLayout() {
    return (
        <Stack>
            <Stack.Screen 
                name="edit"
                options={{
                    headerShown: false,
                    presentation: 'modal'
                }}
            />
        </Stack>
    );
} 