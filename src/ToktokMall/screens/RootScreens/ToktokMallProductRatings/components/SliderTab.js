import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import CustomIcon from '../../../../Components/Icons';

export const SliderTab = (props) => {

  const [activeTab, setActiveTab] = useState(props.index || 0)

  const onTabPress = (index) => {
    setActiveTab(index)
    if(props.onTabChange){
      props.onTabChange(index)
    }
  }

	return (
		<>
			<View style={styles.container}>
					
					<FlatList 
						data={[1]}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.flatlist}
						renderItem={({item}) => {

							let activeBg = "#FFEBBC"
							let inactiveBg = "#F8F8F8"
							let activeCol = "#F6841F"
							let inactiveCol = "#929191"

							return (
								<>
									<TouchableOpacity onPress={() => onTabPress(0)} style={{backgroundColor: activeTab == 0 ? activeBg : inactiveBg, ...styles.tabButton}}>
								 		<Text style={{color: activeTab == 0 ? activeCol : inactiveCol}}>All Comments</Text>
								 	</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(1)} style={{backgroundColor: activeTab == 1 ? activeBg : inactiveBg, ...styles.marginLeft, ...styles.tabButton1}}>
								 		<Text style={{color: activeTab == 1 ? activeCol : inactiveCol}}>Photos & Videos</Text>
								 	</TouchableOpacity>
									<TouchableOpacity onPress={() => onTabPress(2)} style={{backgroundColor: activeTab == 2 ? activeBg : inactiveBg, ...styles.marginLeft, ...styles.tabButton2}}>
								 		<Text style={{color: activeTab == 2 ? activeCol : inactiveCol}}>5 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
									<TouchableOpacity onPress={() => onTabPress(3)} style={{backgroundColor: activeTab == 3 ? activeBg : inactiveBg, ...styles.marginLeft, ...styles.tabButton2}}>
								 		<Text style={{color: activeTab == 3 ? activeCol : inactiveCol}}>4 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(4)} style={{backgroundColor: activeTab == 4 ? activeBg : inactiveBg, ...styles.marginLeft, ...styles.tabButton2}}>
								 		<Text style={{color: activeTab == 4 ? activeCol : inactiveCol}}>3 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(5)} style={{backgroundColor: activeTab == 5 ? activeBg : inactiveBg, ...styles.marginLeft, ...styles.tabButton2}}>
								 		<Text style={{color: activeTab == 5 ? activeCol : inactiveCol}}>2 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(6)} style={{backgroundColor: activeTab == 6 ? activeBg : inactiveBg, ...styles.marginLeft, ...styles.tabButton2}}>
								 		<Text style={{color: activeTab == 6 ? activeCol : inactiveCol}}>1 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
								</>
							)

						}}
					/>

				</View>

				<View style={{ height: 2, backgroundColor: '#F7F7FA'}} />
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 0
	},
	flatlist: {
		justifyContent: 'center',
		paddingHorizontal: 15, 
		paddingVertical: 15
	},
	tabButton: {
		paddingHorizontal: 15, 
		paddingVertical: 6,
		borderRadius: 5
	},
	marginLeft: {
		marginLeft: 15,
		borderRadius: 5
	},
	tabButton1: {
		paddingHorizontal: 15, 
		paddingVertical: 6
	},
	tabButton2: {
		paddingHorizontal: 8,
		paddingVertical: 6
	}
})