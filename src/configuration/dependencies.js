const getDependencies = (options) => {
  switch (options.cssFramework) {
    case 'Bootstrap':
      return {
        '@popperjs/core': '2.11.8',
        bootstrap: '5.3.3',
      };
  }
};

export default getDependencies;
