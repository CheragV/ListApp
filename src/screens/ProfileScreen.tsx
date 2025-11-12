import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { User, UserRole } from '../types/user';
import { useUsers } from '../hooks/useUsers';
import { validateUser } from '../utils/validation';
import { Colors } from '../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { getUserById, updateUser, deleteUser, refresh } = useUsers();
  
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Manager);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const userData = await getUserById(id);
      if (userData) {
        setUser(userData);
        const nameParts = userData.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setEmail(userData.email);
        setRole(userData.role as UserRole);
      } else {
        Alert.alert('Error', 'User not found');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const validationErrors = validateUser(fullName, email);

    if (validationErrors.length > 0) {
      const errorMap: { [key: string]: string } = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setUpdating(true);
    try {
      await updateUser(id, {
        name: fullName,
        email: email.trim(),
        role,
      });
      await refresh();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update user. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user?.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setUpdating(true);
            try {
              await deleteUser(id);
              await refresh();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user. Please try again.');
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Edit User</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={firstName}
            onChangeText={handleFirstNameChange}
            placeholder="First Name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={lastName}
            onChangeText={handleLastNameChange}
            placeholder="Last Name"
            autoCapitalize="words"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>User Role</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === UserRole.Admin && styles.roleButtonSelected,
              ]}
              onPress={() => setRole(UserRole.Admin)}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === UserRole.Admin && styles.roleButtonTextSelected,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === UserRole.Manager && styles.roleButtonSelected,
              ]}
              onPress={() => setRole(UserRole.Manager)}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === UserRole.Manager && styles.roleButtonTextSelected,
                ]}
              >
                Manager
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.updateButton, updating && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={updating}
        >
          <Text style={styles.updateButtonText}>Update User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton, updating && styles.buttonDisabled]}
          onPress={handleDelete}
          disabled={updating}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
          <Text style={styles.deleteButtonText}>Delete User</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 24,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  roleButtonSelected: {
    backgroundColor: Colors.background,
    borderColor: Colors.primary,
  },
  roleButtonText: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '500',
  },
  roleButtonTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.error,
    gap: 8,
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: 18,
    fontWeight: '600',
  },
});