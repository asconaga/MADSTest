import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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
import { getAllStatuses } from './services/statusDB';
import { createSurvey, deleteSurvey, getAllSurveys, updateSurvey } from './services/surveyDB';
import { getAllUsers } from './services/userDB';

export default function SurveyListScreen({ navigation }) {
  const [surveys, setSurveys] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCreatedBy, setEditedCreatedBy] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadStatuses();
  }, []);

  // Refresh data each time screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadSurveys();
      loadUsers();
    }, [])
  );

  useEffect(() => {
    loadSurveys();
    loadStatuses();
    loadUsers();
  }, []);

  async function loadSurveys() {
    try {
      const all = await getAllSurveys();
      setSurveys(all);
    } catch (err) {
      console.error('Error loading surveys', err);
    }
  }

  async function loadStatuses() {
    try {
      const statuses = await getAllStatuses();
      setStatusList(statuses);
    } catch (err) {
      console.error('Error loading statuses', err);
    }
  }

  async function loadUsers() {
    try {
      const users = await getAllUsers();
      setUserList(users);
    } catch (err) {
      console.error('Error loading users', err);
    }
  }

  function openModal(survey = null) {
    setSelectedSurvey(survey);
    if (survey) {
      setEditedName(survey.name);
      setEditedDescription(survey.description);
      setEditedCreatedBy(survey.createdBy.toString());
      setEditedStatus(survey.status.toString());
    } else {
      setEditedName('');
      setEditedDescription('');
      setEditedCreatedBy('');
      setEditedStatus('');
    }
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setSelectedSurvey(null);
  }

  async function onSave() {
    if (!editedName.trim() || !editedCreatedBy || !editedStatus) {
      console.log("Not save");
      return;
    }
    try {
      const surveyObj = {
        surveyId: selectedSurvey ? selectedSurvey.surveyId : 0,
        name: editedName.trim(),
        description: editedDescription.trim(),
        createdBy: parseInt(editedCreatedBy, 10),
        createdOn: new Date().toISOString(),
        status: parseInt(editedStatus, 10)
      };
      if (selectedSurvey) {
        await updateSurvey(surveyObj);
      } else {
        await createSurvey(surveyObj);
      }
      closeModal();
      loadSurveys();
    } catch (err) {
      console.error('Error saving survey', err);
    }
  }

  async function onDelete() {
    if (!selectedSurvey) return;
    try {
      await deleteSurvey(selectedSurvey.surveyId);
      closeModal();
      loadSurveys();
    } catch (err) {
      console.error('Error deleting survey', err);
    }
  }

  function renderSurvey({ item }) {
    const statusObj = statusList.find(s => s.statusId === item.status);
    const statusText = statusObj ? statusObj.name : item.status;
    const userObj = userList.find(u => u.userId === item.createdBy);
    const userText = userObj ? userObj.name : item.createdBy;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openModal(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>{item.name} ({item.surveyId})</Text>
        <Text style={styles.cardSubtitle}>Status: {statusText}</Text>
        <Text style={styles.cardSubtitle}>Created By: {userText}</Text>
      </TouchableOpacity>
    );
  }

  function renderAddNew() {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openModal()}
        activeOpacity={0.8}
      >
        <Text style={[styles.cardTitle, styles.addText]}>+ Add New Survey</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={surveys}
        keyExtractor={item => item.surveyId.toString()}
        renderItem={renderSurvey}
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
              {selectedSurvey ? 'Edit Survey' : 'New Survey'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Name"
            />
            <TextInput
              style={[styles.modalInput, styles.textarea]}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Description"
              multiline
            />
            {/* User Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Created By:</Text>
              <Picker
                selectedValue={editedCreatedBy}
                onValueChange={value => setEditedCreatedBy(value)}
              >
                <Picker.Item label="Select user..." value="" />
                {userList.map(u => (
                  <Picker.Item
                    key={u.userId}
                    label={u.name}
                    value={u.userId.toString()}
                  />
                ))}
              </Picker>
            </View>
            {/* Status Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Status:</Text>
              <Picker
                selectedValue={editedStatus}
                onValueChange={value => setEditedStatus(value)}
              >
                <Picker.Item label="Select status..." value="" />
                {statusList.map(s => (
                  <Picker.Item
                    key={s.statusId}
                    label={s.name}
                    value={s.statusId.toString()}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={closeModal} />
              {selectedSurvey && (
                <Button title="Delete" onPress={onDelete} color="#d9534f" />
              )}
              <Button title={selectedSurvey ? 'Save' : 'Add'} onPress={onSave} />
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
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#555',
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
    width: '85%',
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
    marginBottom: 12,
    borderRadius: 8
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden'
  },
  pickerLabel: {
    padding: 8,
    fontSize: 14,
    fontWeight: '500'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
