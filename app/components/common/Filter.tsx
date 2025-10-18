import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type OrderOption = 'Ascendente' | 'Descendente';
type TipoOption = 'Todas' | 'Entrada' | 'Salida';

interface FilterProps {
  label?: string;
  activeOrder?: OrderOption;
  onOrderChange?: (value: OrderOption) => void;
  tipoActive?: TipoOption;
  onTipoChange?: (value: TipoOption) => void;
}

const orderOptions: OrderOption[] = ['Ascendente', 'Descendente'];
const tipoOptions: TipoOption[] = ['Todas', 'Entrada', 'Salida'];

const getIcon = (active: string) => {
  if (active === 'Ascendente') {
    return <MaterialCommunityIcons name="sort-ascending" size={22} color="#CE0E2D" />;
  }
  if (active === 'Descendente') {
    return <MaterialCommunityIcons name="sort-descending" size={22} color="#CE0E2D" />;
  }
  return <Ionicons name="filter" size={22} color="#CE0E2D" />;
};

const Filter: React.FC<FilterProps> = ({
  label = 'Ordenar por:',
  activeOrder = 'Ascendente',
  onOrderChange,
  tipoActive = 'Todas',
  onTipoChange,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleOrderSelect = (value: OrderOption) => {
    setDropdownVisible(false);
    if (onOrderChange) onOrderChange(value);
  };

  return (
    <View>
      <View style={styles.filterRow}>
        <Text style={styles.filterText}>
          {label} <Text style={styles.filterActive}>{activeOrder}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setDropdownVisible(v => !v)}
          style={styles.iconBtn}
        >
          {getIcon(activeOrder)}
          <Ionicons
            name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#CE0E2D"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdown}>
            {orderOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionBtn,
                  activeOrder === opt && styles.optionActive,
                ]}
                onPress={() => handleOrderSelect(opt)}
              >
                <Text style={[
                  styles.optionText,
                  activeOrder === opt && styles.optionTextActive,
                ]}>
                  {opt}
                </Text>
                {getIcon(opt)}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <View style={styles.tipoFiltroRow}>
        {tipoOptions.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.tipoFiltroBtn,
              tipoActive === opt && styles.tipoFiltroBtnActive,
            ]}
            onPress={() => onTipoChange && onTipoChange(opt)}
          >
            <Text style={[
              styles.tipoFiltroText,
              tipoActive === opt && styles.tipoFiltroTextActive,
            ]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  filterText: {
    color: '#5C5C60',
    fontSize: 14,
  },
  filterActive: {
    color: '#CE0E2D',
    fontWeight: 'bold',
  },
  iconBtn: {
    marginLeft: 'auto',
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    right: -8,
    top: 38,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minWidth: 160,
    zIndex: 100,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  optionActive: {
    backgroundColor: '#F5F5F5',
  },
  optionText: {
    flex: 1,
    color: '#5C5C60',
    fontSize: 16,
  },
  optionTextActive: {
    color: '#CE0E2D',
    fontWeight: 'bold',
  },
  tipoFiltroRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  tipoFiltroBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#EDEDED',
  },
  tipoFiltroBtnActive: {
    backgroundColor: '#CE0E2D',
  },
  tipoFiltroText: {
    color: '#5C5C60',
    fontWeight: 'bold',
  },
  tipoFiltroTextActive: {
    color: '#fff',
  },
});

export default Filter;