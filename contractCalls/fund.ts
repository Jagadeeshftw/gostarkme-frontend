import { fundAbi } from "@/contracts/abis/fund";
import { formatNumber } from "@/lib/helper";
import { useReadContract, useAccount } from "@starknet-react/core";

interface Donator {
  userAddress: `0x${string}` | undefined;
  fundAddress: `0x${string}` | undefined;
}

export function useGetSingleDonatorByAddress({ userAddress, fundAddress }: Donator) {

  const { data, isLoading, refetch, isFetching, error } = useReadContract({
    abi: fundAbi,
    functionName: "get_single_donator_by_address",
    address: fundAddress,
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
