import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet,Platform,Dimensions,StatusBar,Image, TouchableOpacity, FlatList} from 'react-native'
import { HeaderBack, HeaderTitle, HeaderRight } from '../../../Components';
import { AlertOverlay} from '../../../../components';
import { COLOR, FONT, FONT_SIZE } from '../../../../res/variables';
import CheckBox from 'react-native-check-box';

const testdata = [{
    store: "Face Mask PH",
    cart: [{
        label: "Improved Copper Mask 2.0 White or Bronze",
        originalPrice: 380,
        price: 190,
        variation: "Bronze",
        qty: 1
    }, {
        label: "Improved Copper Mask 2.0 White or Bronze",
        originalPrice: 380,
        price: 190,
        variation: "White",
        qty: 1
    }]
}, {
    store: "The Apparel",
    cart: [{
        label: "Graphic Tees",
        originalPrice: 380,
        price: 190,
        variation: "White, L",
        qty: 2
    }]
}, {
    store: "The Apparel",
    cart: [{
        label: "Graphic Tees",
        originalPrice: 380,
        price: 190,
        variation: "White, L",
        qty: 2
    }]
}]

const Store = ({data}) => {
    return (
        <>
            <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <CheckBox
                            isChecked={false}
                            checkedCheckBoxColor="#F6841F"
                            uncheckedCheckBoxColor="#F6841F"
                            onClick={() => {
                                setAllSelected(!allSelected)
                            }}
                        />
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                       <Image source={require("../../../../assets/toktokmall-assets/icons/store.png")} style={{width: 18, height: 18, resizeMode: 'stretch'}} />
                    </View>
                    <View style={{flex: 9, justifyContent: 'center', flexDirection: 'row'}}>                        
                        <View style={{flex: 12, justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>{data.store}</Text>
                        </View>
                    </View>
                </View>
                <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
        </>
    )
}

const Item = ({data}) => {
    return (
        <>
            <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <CheckBox
                            isChecked={false}
                            checkedCheckBoxColor="#F6841F"
                            uncheckedCheckBoxColor="#F6841F"
                            onClick={() => {
                                setAllSelected(!allSelected)
                            }}
                        />
                    </View>
                    <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                       <Image source={require("../../../../assets/toktokmall-assets/images/coppermask.png")} style={{width: 50, height: 65, resizeMode: 'stretch'}} />
                    </View>
                    <View style={{flex: 9, justifyContent: 'center', flexDirection: 'row'}}>                        
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <View>
                                <Text style={{fontSize: 14, fontWeight: '100'}}>{data.label}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0}}>
                                    <Text style={{fontSize: 13, color: "#F6841F"}}>&#8369;{parseFloat(data.price).toFixed(2)}</Text>
                                </View>
                                <View style={{flex: 0, paddingHorizontal: 15}}>
                                    <Text style={{color: "#9E9E9E", textDecorationLine: 'line-through', fontSize: 10}}>&#8369;{parseFloat(data.originalPrice).toFixed(2)}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1}}>
                                    <Text style={{color: "#9E9E9E", fontSize: 13}}>Variation: {data.variation}</Text>
                                </View>
                                <View style={{flex: 0}}>
                                    <Text style={{color: "#9E9E9E", fontSize: 13}}>Qty: {data.qty}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{height: 2, backgroundColor: '#F7F7FA'}} />
        </>
    )
}

const CheckoutFooter = () => {
    return (
        <>
            <View 
                style={{flex: 1, backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%'}}
            >
                <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, fontFamily: FONT.BOLD}}>Subtotal </Text>
                        <Text style={{fontSize: 18, color: "#F6841F"}}>&#8369;{parseFloat(0).toFixed(2)}</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <TouchableOpacity style={{backgroundColor: '#F6841F', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 5}}>
                            <Text style={{fontSize: 14, color: '#fff'}}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}

const DeleteFooter = () => {
    return (
        <>
            <View 
                    style={{flex: 1, backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%'}}
                >
                    <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>                        
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                            <TouchableOpacity style={{backgroundColor: '#F6841F', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 5}}>
                                <Text style={{fontSize: 14, color: '#fff'}}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
        </>
    )
}


export const ToktokMallMyCart = ({navigation})=> {

    const [allSelected, setAllSelected] = useState(false)
    const [willDelete, setWillDelete] = useState(false)

    navigation.setOptions({
        headerLeft: () => <HeaderBack hidden={true} />,
        headerTitle: () => <HeaderTitle label={['Shopping Cart', '']} />,
        headerRight: () => <HeaderRight hidden={true} />
    });

    return (
        <>
        <View style={styles.container}>
            <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
            <View style={{flex: 1}}> 

                <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
                    <View style={{flex: 6, justifyContent: 'center'}}>
                        <CheckBox
                            isChecked={allSelected}
                            rightText="Select All"
                            rightTextStyle={{fontSize: 14, fontWeight: '500'}}
                            checkedCheckBoxColor="#F6841F"
                            uncheckedCheckBoxColor="#F6841F"
                            onClick={() => {
                                setAllSelected(!allSelected)
                            }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => setWillDelete(!willDelete)} style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, color: "#F6841F"}}>{willDelete ? "Done" : "Edit"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 2, backgroundColor: '#F7F7FA'}} />          
                
                <FlatList 
                    data={testdata}
                    renderItem={({item}) => {
                        return (
                            <>
                                <Store data={item} />
                                {item.cart.map((data, i) => <Item data={data} />)}
                                <View style={{height: 8, backgroundColor: '#F7F7FA'}} />
                            </>
                        )
                    }}
                />

                <View style={{height: 80}}></View>

                {willDelete ? <DeleteFooter /> : <CheckoutFooter />}
                
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.WHITE
    }
})
