// 向本地存数据
export function saveToLocal(id, key, value) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    seller = {};
    seller[id] = {};
    seller[id][key] = value;
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage._seller_ = JSON.stringify(seller);

}

// 向本地获取数据
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller[id]){
    return def;
  }
  let ret= seller[key];
  return ret || def;
}
