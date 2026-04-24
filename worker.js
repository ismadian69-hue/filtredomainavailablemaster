function clean(t){
  return t
    .toLowerCase()
    .replace(/\r/g, "")
    .replace(/\s+/g, "")
    .trim();
}

onmessage = function(e){

  const {text1, text2} = e.data;

  // domains file
  const domainSet = new Set(
    text1.split(/\r?\n/)
      .map(clean)
      .filter(Boolean)
  );

  const lines = text2.split(/\r?\n/);

  let results = new Set();

  for(let i=0;i<lines.length;i++){

    let line = lines[i];
    if(!line.includes(":")) continue;

    // extract domain قبل :
    let idx = line.indexOf(":");
    let rawDomain = line.slice(0, idx);

    let domain = clean(rawDomain);

    // DEBUG (مهم)
    // console.log("CHECK:", domain);

    if(domainSet.has(domain)){
      results.add(domain);
    }

    if(i % 500 === 0){
      postMessage({
        type:"progress",
        value: Math.floor((i/lines.length)*100)
      });
    }
  }

  postMessage({
    type:"done",
    result: [...results]
  });
};
