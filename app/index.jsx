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
import { createSurvey, deleteSurvey, getAllSurveys, updateSurvey } from './services/surveyDB';

export default function SurveyListScreen() {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCreatedBy, setEditedCreatedBy] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadSurveys();
  }, []);

  async function loadSurveys() {
    try {
      const all = await getAllSurveys();
      setSurveys(all);
    } catch (err) {
      console.error('Error loading surveys', err);
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
    if (!editedName.trim() || !editedCreatedBy.trim() || !editedStatus.trim()) return;
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
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openModal(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>ID: {item.surveyId}</Text>
        <Text style={styles.cardSubtitle}>Status: {item.status}</Text>
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
            <TextInput
              style={styles.modalInput}
              value={editedCreatedBy}
              onChangeText={setEditedCreatedBy}
              placeholder="Created By (User ID)"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              value={editedStatus}
              onChangeText={setEditedStatus}
              placeholder="Status ID"
              keyboardType="numeric"
            />
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
