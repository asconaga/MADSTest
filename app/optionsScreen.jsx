import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OPTIONS = [
    { id: '1', title: 'User Options', route: 'userListScreen' },
    { id: '2', title: 'Survey Options', route: 'SurveyList' },
    { id: '3', title: 'Settings', route: 'Settings' }
];

export default function OptionsForm({ navigation }) {
    const router = useRouter();

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/${item.route}`)}
            activeOpacity={0.8}
        >
            <View style={styles.cardContent}>
                <View style={styles.icon} />
                <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={OPTIONS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0'
    },
    listContent: {
        paddingVertical: 8
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        marginVertical: 8,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Android shadow
        elevation: 3
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4A90E2',
        marginRight: 12
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600'
    }
});
