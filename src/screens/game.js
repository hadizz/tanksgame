import React, {
  useState,
  useEffect
} from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
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

  const [targets, setTargets] = useState(null);

  const randomTargets = () => {
    let arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push([Math.floor(Math.random() * (windowWidth - 50)) + 20, Math.floor(Math.random() * (landH - 50)) + 20])
    }
    return arr;
  }

  useEffect(() => {
    console.log('\n\n\t\t---------------------------\n\n\t\t\t\t\t [] called');
    setTargets(randomTargets());
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
    <View style={{ fontFamily: "IRANSansWeb(FaNum)_Bold" }}>

      <TouchableWithoutFeedback>
        <View style={{ height: landH, backgroundColor: '#a8ffc0', }}>
          {targets && targets.map((target, index) => (
            <Image key={index} style={{ position: "absolute", top: target[1], left: target[0], width: 30, height: 30 }}
              source={require('../assets/img/tank.png')} />
          ))}
          {(bombs !== 10) &&
            <Image
              style={{ top: landH - bombAtUp[0] - 15, left: bombAtUp[1] - 15, width: 30, height: 30 }}
              source={require('../assets/img/bomb.png')}
            />
          }
        </View>
      </TouchableWithoutFeedback>

      <View style={{ height: infoH, width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: "auto" }} >
        <View style={{ marginTop: 4, marginBottom: 4, flexDirection: "row-reverse", justifyContent: "space-between" }}>
          <Text style={styles.f14}>نوبت {turn}</Text>
          <Text style={styles.f14}>تعداد بمب {bombs}</Text>
        </View>
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
          <TouchableOpacity style={styles.btn1} onPress={() => attack()}><Text style={styles.attackbtn}>آتش</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={() => refreshGame()}><Text style={styles.restartbtn}>شروع مجدد</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn3}><Text style={styles.backbtn}>بازگشت</Text></TouchableOpacity>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={(event) => handlePressDown(event)}>
        <View style={{ height: landH, backgroundColor: '#ffdbdb' }}>
          {(x !== 0) &&
            <Image style={{ top: y - 15, left: x - 15, width: 30, height: 30 }} source={require('../assets/img/bomb.png')} />
          }
        </View>
      </TouchableWithoutFeedback>

    </View>
  );
}


const styles = StyleSheet.create({
  infoSection: {

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
    borderColor: "red",
    borderWidth: 1.5,

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
});

export default Game;
