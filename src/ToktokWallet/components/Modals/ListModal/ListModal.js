/**
 * @format
 * @flow
 */

import React, {useMemo, useState, useCallback} from 'react';

import type {PropsType} from './types';
import {
  BackButton,
  BackButtonIcon,
  Container,
  ContainerList,
  ContainerWithSearch,
  ContentContainer,
  CustomModal,
  DefaultText,
  ItemDetailsContainer,
  ItemSeparator,
  List,
  Name,
  SearchInputField,
} from './Styled';
import {NoData} from 'toktokwallet/components';

const checkDisplay = ({item, defaultCondition}) => {
  if (defaultCondition) {
    return {
      defCon: item.nationality === defaultCondition,
      name: item.nationality,
    };
  } else if (item.name) {
    return {
      name: item.name,
    };
  } else if (item.provDesc) {
    return {
      name: item.provDesc,
    };
  } else if (item.citymunDesc) {
    return {
      name: item.citymunDesc,
    };
  } else {
    return {
      name: item.description,
    };
  }
};

const ItemDetails = ({
  item,
  index,
  defaultCondition,
  hasDefault,
  onChangeSelect,
  setVisible,
  setSearch,
  removeValue,
  multiple,
}) => {
  const display = checkDisplay({item, defaultCondition});
  const disabled = multiple && removeValue === display.name;

  return (
    <ItemDetailsContainer
      disabled={disabled}
      onPress={() => {
        onChangeSelect({value: display.name, index});
        setVisible(false);
        setSearch('');
      }}>
      <Name disabled={disabled}>{display.name}</Name>
      {display.defCon && hasDefault && <DefaultText>(Default)</DefaultText>}
    </ItemDetailsContainer>
  );
};

const ListModal = (props: PropsType): React$Node => {
  const {
    visible,
    setVisible,
    data,
    onChangeSelect,
    withSearch = false,
    onSearchValue,
    hasDefault,
    defaultCondition,
    searchPlaceholder,
    multiple,
    removeValue,
  } = props;

  const [search, setSearch] = useState('');

  const onChangeSearch = useCallback(
    value => {
      onSearchValue(value);
      setSearch(value);
    },
    [onSearchValue],
  );

  const onPressClose = () => {
    setVisible(false);
  };

  const DisplayList = () => {
    return (
      <List
        data={data}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListEmptyComponent={() => {
          return <NoData type="search" title="No Results Found" label="Try to search something similar." />;
        }}
        renderItem={({item, index}) => (
          <ItemDetails
            item={item}
            index={index}
            defaultCondition={defaultCondition}
            hasDefault={hasDefault}
            onChangeSelect={onChangeSelect}
            setVisible={setVisible}
            setSearch={setSearch}
            multiple={multiple}
            removeValue={removeValue}
          />
        )}
      />
    );
  };

  const ListWithSearch = useMemo(() => {
    return (
      <ContainerWithSearch>
        <ContentContainer>
          <BackButton onPress={() => setVisible(false)}>
            <BackButtonIcon />
          </BackButton>
          <SearchInputField
            onChangeText={val => onChangeSearch(val)}
            placeholder={searchPlaceholder}
            search={search}
            onClear={() => {
              onSearchValue('');
              setSearch('');
            }}
          />
        </ContentContainer>
        <ContainerList withSearch={withSearch}>
          <DisplayList />
        </ContainerList>
      </ContainerWithSearch>
    );
  }, [withSearch, onSearchValue, setSearch, setVisible, onChangeSearch, search, searchPlaceholder]);

  const ListWithoutSearch = () => {
    return (
      <ContainerList>
        <DisplayList />
      </ContainerList>
    );
  };

  return (
    <CustomModal visible={visible} onRequestClose={onPressClose}>
      <Container>{withSearch ? ListWithSearch : <ListWithoutSearch />}</Container>
    </CustomModal>
  );
};

export default ListModal;
