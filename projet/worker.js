function clean(t){
  return t.toLowerCase()
    .replace(/[^\x00-\x7F]/g,"")
    .trim();
}

onmessage = function(e){

  const {text1, text2} = e.data;

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

    let idx = line.indexOf(":");
    let domain = clean(line.slice(0, idx));

    if(domainSet.has(domain)){
      results.add(domain);
    }

    // progress update
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
