import { useEffect, useState } from 'react';
import {
    Button,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { createUser, deleteUser, getAllUsers, updateUser } from './services/userDB';

export default function UserListScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const all = await getAllUsers();
            setUsers(all);
        } catch (err) {
            console.error(err);
        }
    }

    async function onSave() {
        if (!editedName.trim()) return;
        try {
            if (selectedUser) {
                await updateUser({ userId: selectedUser.userId, name: editedName });
            } else {
                const newId = Date.now();
                await createUser({ userId: newId, name: editedName });
            }
            closeModal();
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    }

    async function onDelete() {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser.userId);
            closeModal();
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    }

    function closeModal() {
        setModalVisible(false);
        setSelectedUser(null);
        setEditedName('');
    }

    function renderUser({ item }) {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    setSelectedUser(item);
                    setEditedName(item.name);
                    setModalVisible(true);
                }}
                activeOpacity={0.8}
            >
                <Text style={styles.cardTitle}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    function renderAddNew() {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    setSelectedUser(null);
                    setEditedName('');
                    setModalVisible(true);
                }}
                activeOpacity={0.8}
            >
                <Text style={[styles.cardTitle, styles.addText]}>+ Add New User</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={item => item.userId.toString()}
                renderItem={renderUser}
                ListHeaderComponent={renderAddNew}
                contentContainerStyle={styles.listContent}
            />

            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedUser ? 'Edit User' : 'New User'}
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editedName}
                            onChangeText={setEditedName}
                            placeholder="Enter name"
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={closeModal} />
                            {selectedUser && <Button title="Delete" onPress={onDelete} color="#d9534f" />}
                            <Button title={selectedUser ? 'Save' : 'Add'} onPress={onSave} />
                        </View>
                    </View>
                </View>
            </Modal>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600'
    },
    cardId: {
        fontSize: 14,
        color: '#888',
        marginTop: 4
    },
    addText: {
        color: '#4A90E2'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center'
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 8
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
