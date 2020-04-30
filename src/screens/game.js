import React, {
  useState,
  useEffect
} from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  Modal,
  Dimensions,
  StyleSheet,
  Image,
  StatusBar
} from 'react-native';

const Game = () => {

  let land = 5;
  let info = 1;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [bombAtUp, setBombAtUp] = useState([0, 0]);

  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height - StatusBar.currentHeight);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [landH, setLandH] = useState(windowHeight / 11 * land);
  const [infoH, setInfoH] = useState(windowHeight / 11 * info);

  const [turn, setTurn] = useState(1);
  const [bombs, setBombs] = useState(10);

  const [targets, setTargets] = useState(randomTargets());

  const [modalVisible, setModalVisible] = useState(false);

  function randomTargets() {
    let arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push([Math.floor(Math.random() * (windowWidth - 50)) + 20, Math.floor(Math.random() * (landH - 50)) + 20])
    }
    return arr;
  }

  useEffect(() => {
    console.log('\n\n\t\t---------------------------\n\n\t\t\t\t\t [] called');
    // setTargets(randomTargets());
    console.log("window Height : ", windowHeight);
    console.log("window width : ", windowWidth);

  }, []);

  useEffect(() => {
    console.log('turn changed : ', turn);
    console.log('bombs changed : ', bombs);
    console.log('targets changed : ', targets);
  }, [targets, bombs, turn]);

  useEffect(() => {
    console.log('do i hit the tank?');
  });



  handlePressDown = (event) => {
    console.log('x ', x);
    console.log('y ', y);

    setX(event.nativeEvent.locationX);
    setY(event.nativeEvent.locationY);

  };

  const attack = () => {
    console.log('Called With x:', x, ' y:', y);

    setBombAtUp([y, x]);

    setBombs(bombs - 1);

    if (turn == 1) {
      setTurn(2);
    } else {
      setTurn(1);
    }
  }

  const refreshGame = () => {
    setBombAtUp([0, 0]);
    setX(0);
    setY(0);
    setTurn(1);
    setBombs(10);
    setTargets(randomTargets());
  }

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.modalcontainer}>
          <View style={styles.modalinnercontainer}>
            <Text style={styles.f14}>تنظیمات بازی</Text>
            <TouchableOpacity style={styles.btn5} onPress={() => setModalVisible(!modalVisible)}><Text style={styles.closemodalbtn}>بستن</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableWithoutFeedback>
        <View style={{ height: landH, backgroundColor: '#fff4cc', }}>
          {targets && targets.map((target, index) => (
            <Image key={index} style={{ position: "absolute", top: target[1] - 25 / 2, left: target[0] - 25 / 2, width: 25, height: 25 }}
              source={require('../assets/img/tank.png')} />
          ))}
          {(bombs !== 10) &&
            <Image
              style={{ top: landH - bombAtUp[0] - 25 / 2, left: bombAtUp[1] - 25 / 2, width: 25, height: 25 }}
              source={require('../assets/img/bomb.png')}
            />
          }
        </View>
      </TouchableWithoutFeedback>

      <View style={{ borderColor: "black", height: infoH, width: "95%", marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: "auto" }} >
        <View style={{ marginBottom: 4, flexDirection: "row-reverse", justifyContent: "space-between" }}>
          <Text style={styles.f14}>نوبت {turn}</Text>
          <Text style={styles.f14}>تعداد بمب {bombs}</Text>
        </View>
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
          <TouchableOpacity style={styles.btn1} onPress={() => attack()}><Text style={styles.attackbtn}>آتش</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={() => refreshGame()}><Text style={styles.restartbtn}>شروع مجدد</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn3} onPress={() => setModalVisible(true)}><Text style={styles.settingsbtn}>تنظیمات</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn4}><Text style={styles.backbtn}>بازگشت</Text></TouchableOpacity>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={(event) => handlePressDown(event)}>
        <View style={{ height: landH, backgroundColor: '#fff4cc' }}>
          {(x !== 0) &&
            <Image style={{ top: y - 25 / 2, left: x - 25 / 2, width: 25, height: 25 }} source={require('../assets/img/bomb.png')} />
          }
        </View>
      </TouchableWithoutFeedback>

    </View >
  );
}


const styles = StyleSheet.create({
  modal: {


  },
  modalcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalinnercontainer: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10
  },
  f14: {
    fontFamily: "IRANSansWeb(FaNum)_Medium",
    fontSize: 12,
  },
  btn1: {
    borderRadius: 20,
    borderColor: "orange",
    borderWidth: 1.5,
    paddingTop: 7, // 7
    paddingBottom: 7, // 7
    paddingRight: 10,
    paddingLeft: 10,
  },
  btn2: {
    borderRadius: 20,
    borderColor: "#32a852",
    borderWidth: 1.5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10,
  },
  btn3: {
    borderRadius: 20,
    borderColor: "blue",
    borderWidth: 1.5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10,
  },
  btn4: {
    borderRadius: 20,
    borderColor: "red",
    borderWidth: 1.5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10,
  },
  btn5: {
    borderRadius: 20,
    backgroundColor: "red",
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10,
  },
  attackbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "orange",
    fontSize: 12,
  },
  restartbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "#32a852",
    fontSize: 12,
  },
  backbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "red",
    fontSize: 12,
  },
  settingsbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "blue",
    fontSize: 12,
  },
  closemodalbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "white",
    fontSize: 12,
  },
});

export default Game;
