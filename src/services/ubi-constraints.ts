/**
 * Centralized UBI Constraint Validation System
 * Single source of truth for all UBI parameter constraints
 */

export interface UbiAmounts {
  child: number;
  youth: number;
  adult: number;
  senior: number;
}

export interface UbiLocks {
  childLocked: boolean;
  youthLocked: boolean;
  adultLocked: boolean;
  seniorLocked: boolean;
}

export interface AgeCutoffs {
  child: number;    // 0-12
  youth: number;    // 13-21  
  senior: number;   // 55-100
}

export interface AgeLocks {
  childLocked: boolean;
  youthLocked: boolean;
  adultLocked: boolean;
  seniorLocked: boolean;
}

export interface ConstraintViolation {
  type: 'progression' | 'lock' | 'range' | 'age';
  field: string;
  message: string;
  originalValue: number;
  correctedValue: number;
}

export interface ConstraintResult {
  isValid: boolean;
  correctedValues: UbiAmounts;
  violations: ConstraintViolation[];
}

export interface AgeConstraintResult {
  isValid: boolean;
  correctedValues: AgeCutoffs;
  violations: ConstraintViolation[];
}

/**
 * Core UBI amount constraint validation function
 * Single source of truth for all UBI amount constraints
 */
export const validateUbiAmounts = (
  values: UbiAmounts,
  locks: UbiLocks,
  context: 'ui' | 'genetic' | 'validation' = 'validation'
): ConstraintResult => {
  const corrected = { ...values };
  const violations: ConstraintViolation[] = [];

  // Range constraints (0-5000 for all)
  const minValue = 0;
  const maxValue = 5000;

  // Apply range constraints
  for (const [key, value] of Object.entries(corrected)) {
    if (value < minValue) {
      violations.push({
        type: 'range',
        field: key,
        message: `${key} UBI cannot be less than $${minValue}`,
        originalValue: value,
        correctedValue: minValue,
      });
      (corrected as any)[key] = minValue;
    } else if (value > maxValue) {
      violations.push({
        type: 'range',
        field: key,
        message: `${key} UBI cannot exceed $${maxValue}`,
        originalValue: value,
        correctedValue: maxValue,
      });
      (corrected as any)[key] = maxValue;
    }
  }

  // Progression constraint: child ≤ youth ≤ adult ≤ senior
  // But respect locks - locked values cannot be changed

  // Youth must be >= child
  if (corrected.youth < corrected.child) {
    if (locks.youthLocked && !locks.childLocked) {
      // Youth is locked, adjust child down
      violations.push({
        type: 'progression',
        field: 'child',
        message: `Child UBI reduced to respect locked youth UBI`,
        originalValue: corrected.child,
        correctedValue: corrected.youth,
      });
      corrected.child = corrected.youth;
    } else if (!locks.youthLocked) {
      // Youth is not locked, adjust youth up
      violations.push({
        type: 'progression',
        field: 'youth',
        message: `Youth UBI increased to maintain progression`,
        originalValue: corrected.youth,
        correctedValue: corrected.child,
      });
      corrected.youth = corrected.child;
    }
  }

  // Adult must be >= youth
  if (corrected.adult < corrected.youth) {
    if (locks.adultLocked && !locks.youthLocked) {
      // Adult is locked, adjust youth down
      violations.push({
        type: 'progression',
        field: 'youth',
        message: `Youth UBI reduced to respect locked adult UBI`,
        originalValue: corrected.youth,
        correctedValue: corrected.adult,
      });
      corrected.youth = corrected.adult;
      // May need to adjust child too
      if (corrected.child > corrected.youth && !locks.childLocked) {
        corrected.child = corrected.youth;
      }
    } else if (!locks.adultLocked) {
      // Adult is not locked, adjust adult up
      violations.push({
        type: 'progression',
        field: 'adult',
        message: `Adult UBI increased to maintain progression`,
        originalValue: corrected.adult,
        correctedValue: corrected.youth,
      });
      corrected.adult = corrected.youth;
    }
  }

  // Senior must be >= adult
  if (corrected.senior < corrected.adult) {
    if (locks.seniorLocked && !locks.adultLocked) {
      // Senior is locked, adjust adult down
      violations.push({
        type: 'progression',
        field: 'adult',
        message: `Adult UBI reduced to respect locked senior UBI`,
        originalValue: corrected.adult,
        correctedValue: corrected.senior,
      });
      corrected.adult = corrected.senior;
      // May need to adjust youth and child too
      if (corrected.youth > corrected.adult && !locks.youthLocked) {
        corrected.youth = corrected.adult;
      }
      if (corrected.child > corrected.youth && !locks.childLocked) {
        corrected.child = corrected.youth;
      }
    } else if (!locks.seniorLocked) {
      // Senior is not locked, adjust senior up
      violations.push({
        type: 'progression',
        field: 'senior',
        message: `Senior UBI increased to maintain progression`,
        originalValue: corrected.senior,
        correctedValue: corrected.adult,
      });
      corrected.senior = corrected.adult;
    }
  }

  return {
    isValid: violations.length === 0,
    correctedValues: corrected,
    violations,
  };
};

/**
 * Core age cutoff constraint validation function
 */
export const validateAgeCutoffs = (
  values: AgeCutoffs,
  locks: AgeLocks,
  context: 'ui' | 'genetic' | 'validation' = 'validation'
): AgeConstraintResult => {
  const corrected = { ...values };
  const violations: ConstraintViolation[] = [];

  // Range constraints
  corrected.child = Math.max(0, Math.min(12, corrected.child));
  corrected.youth = Math.max(13, Math.min(21, corrected.youth));
  corrected.senior = Math.max(55, Math.min(100, corrected.senior));

  // Progression constraint: child < youth < senior
  // Ensure proper gaps between age groups

  if (corrected.child >= corrected.youth) {
    if (!locks.youthLocked) {
      corrected.youth = corrected.child + 1;
    } else if (!locks.childLocked) {
      corrected.child = corrected.youth - 1;
    }
  }

  if (corrected.youth >= corrected.senior) {
    if (!locks.seniorLocked) {
      corrected.senior = corrected.youth + 1;
    } else if (!locks.youthLocked) {
      corrected.youth = corrected.senior - 1;
    }
  }

  return {
    isValid: violations.length === 0,
    correctedValues: corrected,
    violations,
  };
};

/**
 * UI-specific wrapper for UBI amount validation
 * Optimized for real-time UI feedback
 */
export const validateUbiForUI = (
  values: UbiAmounts,
  locks: UbiLocks
): ConstraintResult => {
  return validateUbiAmounts(values, locks, 'ui');
};

/**
 * Genetic algorithm wrapper for UBI amount validation
 * Optimized for batch processing during evolution
 */
export const validateUbiForGenetic = (
  values: UbiAmounts,
  locks: UbiLocks
): ConstraintResult => {
  return validateUbiAmounts(values, locks, 'genetic');
};

/**
 * UI-specific wrapper for age cutoff validation
 */
export const validateAgesForUI = (
  values: AgeCutoffs,
  locks: AgeLocks
): AgeConstraintResult => {
  return validateAgeCutoffs(values, locks, 'ui');
};

/**
 * Genetic algorithm wrapper for age cutoff validation
 */
export const validateAgesForGenetic = (
  values: AgeCutoffs,
  locks: AgeLocks
): AgeConstraintResult => {
  return validateAgeCutoffs(values, locks, 'genetic');
};

/**
 * Helper function to check if a specific UBI amount change is allowed
 */
export const canChangeUbiAmount = (
  field: keyof UbiAmounts,
  newValue: number,
  currentValues: UbiAmounts,
  locks: UbiLocks
): boolean => {
  if ((locks as any)[`${field}Locked`]) {
    return false; // Cannot change locked values
  }

  const testValues = { ...currentValues, [field]: newValue };
  const result = validateUbiAmounts(testValues, locks);
  
  // Check if the new value would be accepted without correction
  return result.correctedValues[field] === newValue;
};
