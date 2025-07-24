import { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getAllStatuses } from './services/statusDB';

export default function StatusListScreen() {
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        loadStatuses();
    }, []);

    async function loadStatuses() {
        try {
            const all = await getAllStatuses();
            setStatuses(all);
        } catch (err) {
            console.error('Error loading statuses', err);
        }
    }

    function renderStatus({ item }) {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name} ({item.statusId})</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={statuses}
                keyExtractor={item => item.statusId.toString()}
                renderItem={renderStatus}
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
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600'
    },
    cardId: {
        fontSize: 12,
        color: '#888',
        marginTop: 4
    }
});
