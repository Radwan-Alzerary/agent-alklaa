import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getCustomers, deleteCustomer } from '../../api';
import { Customer } from '../../types';

const index = ({ navigation }) => {
  const queryClient = useQueryClient();

  // Fetch customers data
  const { data: customers, isLoading, isError, error } = useQuery('customers', getCustomers);

  // Delete customer mutation
  const deleteMutation = useMutation(deleteCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
    },
    onError: (mutationError) => {
      Alert.alert('Error', `Failed to delete customer: ${mutationError.message}`);
    },
  });

  const handleDelete = (customerId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(customerId) },
      ]
    );
  };

  const renderItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('CustomerDetails', { customer: item })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.email}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item._id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading customers...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error fetching customers: {error?.message || 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCustomer')}
      >
        <Text style={styles.addButtonText}>Add Customer</Text>
      </TouchableOpacity>
      {customers.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>No customers available. Add a new customer.</Text>
        </View>
      ) : (
        <FlatList
          data={customers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});
