import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
// import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";


// import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    // const sdk = new ThirdwebSDK("mumbai");
    // const contract = sdk.getContract("0x0672AEE1b529f31099818C5eAE26C84119257c30")
    // const { contract } = useContract("0x0672AEE1b529f31099818C5eAE26C84119257c30");
    // const { contract } = useContract("0x8084e4c4cE29c14F965eB7C19508ba3CCF4C7A46");
    const { contract } = useContract("0x4877349D1Cd8AeA38c7229315aE63420d54dFa7E");
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign([
                address, // owner
                form.title, // title
                form.description, // description
                form.target,
                new Date(form.deadline).getTime(), // deadline,
                form.image,
                form.tokenName,
                form.tokenSym,
            ])

            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failure", error)
        }
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call("getCampaigns");

        console.log(campaigns);

        const parsedCampaings = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            token: campaign.tk,
            tokenName: campaign.tokenName,
            tokenSym: campaign.tokenSym,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i
        }));

        console.log("hello");


        return parsedCampaings;
    }

    const getUserCampaigns = async () => {
        const campaigns = await contract.call("getCampaigns");

        // console.log("hello");

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            token: campaign.tk,
            tokenName: campaign.tokenName,
            tokenSym: campaign.tokenSym,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i
        }));

        console.log(parsedCampaigns);
        const filteredCampaigns = parsedCampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount) });

        return data;
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }


    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                // searchCampaigns,
                donate,
                getDonations
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);