import type { ActivationVariant, PolicyCheck } from "@/lib/contracts";
import { BRAND_RULES } from "@/lib/policies/brand-rules";

const check = (ruleId: string, passes: boolean, message: string, remediation: string): PolicyCheck => ({
  ruleId,
  status: passes ? "pass" : "fail",
  message,
  remediation: passes ? null : remediation,
});

export function evaluateActivationVariant(variant: ActivationVariant, evaluatedAt: string): PolicyCheck[] {
  const copyAndClaim = `${variant.copy} ${variant.claim}`.toLowerCase();
  const rightsPass = !variant.usesMatchFootage && variant.rightsStatus === "cleared_for_demo";
  const claimsPass = !BRAND_RULES.claims.prohibitedTerms.some((term) => copyAndClaim.includes(term));
  const disclosurePass = /#ad|synthetic|competition demo/i.test(variant.disclosure);
  const expiryPass = variant.rightsExpiresAt !== null
    && Number.isFinite(Date.parse(variant.rightsExpiresAt))
    && Date.parse(variant.rightsExpiresAt) > Date.parse(evaluatedAt);

  return [
    check(BRAND_RULES.rights.id, rightsPass, BRAND_RULES.rights.message, BRAND_RULES.rights.remediation),
    check(BRAND_RULES.claims.id, claimsPass, BRAND_RULES.claims.message, BRAND_RULES.claims.remediation),
    check(BRAND_RULES.disclosure.id, disclosurePass, BRAND_RULES.disclosure.message, BRAND_RULES.disclosure.remediation),
    check(BRAND_RULES.inclusion.id, variant.inclusionSafe, BRAND_RULES.inclusion.message, BRAND_RULES.inclusion.remediation),
    check(BRAND_RULES.expiry.id, expiryPass, BRAND_RULES.expiry.message, BRAND_RULES.expiry.remediation),
  ];
}

export const policyChecksPass = (checks: PolicyCheck[]) => checks.every(({ status }) => status === "pass");
