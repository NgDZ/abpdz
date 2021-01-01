export function CheckPolicy(
  policy: string,
  grantedPolicies: { [key: string]: boolean }
): boolean {
  if (!policy) {
    return true;
  }
  if (!grantedPolicies) {
    return false;
  }
  const getPolicy = (k: string) => grantedPolicies[k];

  const orRegexp = /\|\|/g;
  const andRegexp = /&&/g;

  if (orRegexp.test(policy)) {
    const keys = policy.split('||').filter(Boolean);

    if (keys.length < 2) {
      return false;
    }

    return keys.some((k) => getPolicy(k.trim()));
  } else if (andRegexp.test(policy)) {
    const keys = policy.split('&&').filter(Boolean);

    if (keys.length < 2) {
      return false;
    }

    return keys.every((k) => getPolicy(k.trim()));
  }

  return getPolicy(policy);
}
