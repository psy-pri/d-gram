const Dgram = artifacts.require("Dgram");

module.exports = function(deployer) {
    deployer.deploy(Dgram);
};
