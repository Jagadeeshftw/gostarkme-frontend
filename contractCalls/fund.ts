import { fundAbi } from "@/contracts/abis/fund";
import { addrFund } from "@/contracts/addresses";
import { formatNumber } from "@/lib/helper";
import { useReadContract, useAccount } from "@starknet-react/core";

export function useGetSingleDonatorByAddress() {
  const { address: userAddress } = useAccount();

  const { data, isLoading, refetch, isFetching, error } = useReadContract({
    abi: fundAbi,
    functionName: "get_single_donator_by_address",
    address: addrFund,
    args: [userAddress ?? ""],
  });

  // prompt user to connect their wallet
  if (userAddress === undefined) {
    return "please connect your wallet";
  }

  const findDonorByAddress = formatNumber(Number(data?.["donator_address"]));

  if (findDonorByAddress === "0") {
    return "no donation has been made by this address";
  }

  // fetch function state / status varibles
  console.log({ isLoading, refetch, isFetching, error });
  return data;
}
