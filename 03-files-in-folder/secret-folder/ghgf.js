   // console.log(files);
   for (const file of files) {
    if (!(await fs.stat(path.join(dirPath, file))).isDirectory()) {
      // console.log(await fs.stat(path.join(dirPath, file)));
      const fileName = path.parse(file).name;
      const fileExt = path.parse(file).ext.slice(1);
      const fileSize = (await fs.stat(path.join(dirPath, file))).size;
