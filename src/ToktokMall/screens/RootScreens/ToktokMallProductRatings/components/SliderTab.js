import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
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
			<View style={{flex: 0}}>
					
					<FlatList 
						data={[1]}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							justifyContent: 'center',
							paddingHorizontal: 15, 
							paddingVertical: 15
						}}
						renderItem={({item}) => {

							let activeBg = "#FFEBBC"
							let inactiveBg = "#F8F8F8"
							let activeCol = "#F6841F"
							let inactiveCol = "#929191"

							return (
								<>
									<TouchableOpacity onPress={() => onTabPress(0)} style={{paddingHorizontal: 15, paddingVertical: 6, backgroundColor: activeTab == 0 ? activeBg : inactiveBg, borderRadius: 5}}>
								 		<Text style={{color: activeTab == 0 ? activeCol : inactiveCol}}>All Comments</Text>
								 	</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(1)} style={{marginLeft: 15, paddingHorizontal: 15, paddingVertical: 6, backgroundColor: activeTab == 1 ? activeBg : inactiveBg, borderRadius: 5}}>
								 		<Text style={{color: activeTab == 1 ? activeCol : inactiveCol}}>Photos & Videos</Text>
								 	</TouchableOpacity>
									<TouchableOpacity onPress={() => onTabPress(2)} style={{marginLeft: 15, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: activeTab == 2 ? activeBg : inactiveBg, borderRadius: 5}}>
								 		<Text style={{color: activeTab == 2 ? activeCol : inactiveCol}}>5 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(3)} style={{marginLeft: 15, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: activeTab == 3 ? activeBg : inactiveBg, borderRadius: 5}}>
								 		<Text style={{color: activeTab == 3 ? activeCol : inactiveCol}}>4 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(4)} style={{marginLeft: 15, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: activeTab == 4 ? activeBg : inactiveBg, borderRadius: 5}}>
								 		<Text style={{color: activeTab == 4 ? activeCol : inactiveCol}}>3 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(5)} style={{marginLeft: 15, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: activeTab == 5 ? activeBg : inactiveBg, borderRadius: 5}}>
								 		<Text style={{color: activeTab == 5 ? activeCol : inactiveCol}}>2 <CustomIcon.FoIcon name="star" size={12} color="#FFC833" /></Text>							
							 		</TouchableOpacity>
									 <TouchableOpacity onPress={() => onTabPress(6)} style={{marginLeft: 15, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: activeTab == 6 ? activeBg : inactiveBg, borderRadius: 5}}>
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