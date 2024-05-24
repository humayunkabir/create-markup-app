const getDependencies = (options) => {
  switch (options.cssFramework) {
    case 'Bootstrap':
      return {
        bootstrap: '5.3.0',
        '@popperjs/core': '2.11.8',
      };
  }
};

export default getDependencies;
