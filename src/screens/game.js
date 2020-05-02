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
  StatusBar,
  Switch
} from 'react-native';

const Game = () => {

  let land = 5;
  let info = 1;

  const [bombAtDownX, setBombAtDownX] = useState(0);
  const [bombAtDownY, setBombAtDownY] = useState(0);
  const [bombAtUp, setBombAtUp] = useState([0, 0]);

  const [isAttack, setIsAttack] = useState(false);

  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height - StatusBar.currentHeight);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [landH, setLandH] = useState(windowHeight / 11 * land);
  const [infoH, setInfoH] = useState(windowHeight / 11 * info);

  const [turn, setTurn] = useState(1);
  const [bombs, setBombs] = useState(15);

  const [targets, setTargets] = useState(randomTargets());

  const [modalVisible, setModalVisible] = useState(false);

  const [isTwoPlayer, setIsTwoPlayer] = useState(false);
  const toggleSwitch = () => setIsTwoPlayer(!isTwoPlayer);
  const [playerOneBombs, setPlayerOneBombs] = useState(10);
  const [playerTwoBombs, setPlayerTwoBombs] = useState(10);

  function randomTargets() {
    let arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push([Math.floor(Math.random() * (windowWidth - 50)) + 20, Math.floor(Math.random() * (landH - 50)) + 20])
    }
    return arr;
  }

  useEffect(() => {
    // console.log('\n\n\t\t---------------------------\n\n\t\t\t\t\t [] called');
    // console.log("window Height : ", windowHeight);
    // console.log("window width : ", windowWidth);

  }, []);

  useEffect(() => {
    setBombAtUp([bombAtDownX, landH - bombAtDownY]);
    // console.log("x,y at up set");
    setIsAttack(false);
  }, [bombAtDownX, bombAtDownY]);

  useEffect(() => {
    if (bombs === 0) {
      refreshGame();
    }
  }, [bombs]);

  useEffect(() => {
    console.log("\t\ttargets changed");

    if (targets.length === 0) {
      console.log("\t\ttargets are zero");

      refreshGame();
    }
  }, [targets.length]);

  handlePressDown = (event) => {
    event.preventDefault();
    const event_x = event.nativeEvent.pageX;
    const event_y = event.nativeEvent.pageY - landH - infoH;
    // console.log("event   x ", event_x, " y ", event_y);
    setBombAtDownX(event_x);
    setBombAtDownY(event_y);
    // console.log('onpress x ', bombAtDownX, " y ", bombAtDownY);
  };

  function findTheHittedTank() {
    // console.log("up bomb is at ", bombAtUp);
    for (let i = 0; i < targets.length; i++) {
      // console.log("x ", targets[i][0], "y ", targets[i][1]);
      if (bombAtUp[0] > targets[i][0] - 30 && bombAtUp[0] < targets[i][0] + 30 && bombAtUp[1] > targets[i][1] - 30 && bombAtUp[1] < targets[i][1] + 30) {
        // console.log("\t", targets[i][0] - 30, "< x < ", targets[i][0] + 30, " ", targets[i][1] - 30, " < y < ", targets[i][1] + 30);

        console.log("\t", "!!!!! hit !!!!!");
        return i;
      }
    }
    return -1;
  }

  const attack = () => {
    // console.log('Called with down bomb at  x:', bombAtDownX, ' y:', bombAtDownY);
    setIsAttack(true);
    if (!isTwoPlayer) {
      setBombs(bombs - 1);
      var index = findTheHittedTank();
      if (index !== -1) {
        console.log("before ", targets);
        targets.splice(index, 1);
        console.log("after ", targets);
      }
    }
    else {
      if (turn == 1) {
        setTurn(2);
        setPlayerOneBombs(playerOneBombs - 1);
      } else {
        setTurn(1);
        setPlayerTwoBombs(playerTwoBombs - 1);
      }
    }
  }

  const refreshGame = () => {
    setBombAtUp([0, 0]);
    setBombAtDownX(0);
    setBombAtDownY(0);
    setTurn(1);
    setBombs(10);
    setPlayerOneBombs(10);
    setPlayerTwoBombs(10);
    setTargets(randomTargets());
  }

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.modalcontainer}>
          <View style={styles.modalinnercontainer}>
            <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 18, marginBottom: 20 }}>تنظیمات بازی</Text>
            <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 14, marginBottom: 10 }}>بازی {isTwoPlayer ? "دو" : "یک"} نفره</Text>
            <Switch style={{ marginBottom: 20 }} onValueChange={toggleSwitch} value={isTwoPlayer} />
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
          {isAttack &&
            <Image
              style={{ top: bombAtUp[1] - 25 / 2, left: bombAtUp[0] - 25 / 2, width: 25, height: 25 }}
              source={require('../assets/img/bomb.png')}
            />
          }

        </View>
      </TouchableWithoutFeedback>

      <View style={{ borderColor: "black", height: infoH, width: "95%", marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: "auto" }} >
        <View style={{ marginBottom: 4, flexDirection: "row-reverse", justifyContent: "space-between" }}>
          {(isTwoPlayer ?
            <>
              <Text style={styles.f12}>نوبت {turn}</Text>
              <Text style={styles.f12}>تعداد بمب یک : {playerOneBombs}</Text>
              <Text style={styles.f12}>تعداد بمب دو : {playerTwoBombs}</Text>
            </>
            :
            <Text style={styles.f12}>تعداد بمب های باقیمانده : {bombs}</Text>
          )}
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
          {(bombAtDownX !== 0) &&
            <Image style={{ top: bombAtDownY - 25 / 2, left: bombAtDownX - 25 / 2, width: 25, height: 25 }} source={require('../assets/img/bomb.png')} />
          }
        </View>
      </TouchableWithoutFeedback>

    </View >
  );
}


const styles = StyleSheet.create({
  iransans: {
    fontFamily: "IRANSansWeb(FaNum)_Medium",
  },
  modalcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalinnercontainer: {
    width: 200,
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
  f12: {
    fontFamily: "IRANSansWeb(FaNum)_Medium",
    fontSize: 12,
  },
  f14: {
    fontFamily: "IRANSansWeb(FaNum)_Medium",
    fontSize: 14,
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
    fontSize: 14,
  },
});

export default Game;
