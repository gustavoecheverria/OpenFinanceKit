@echo off
cd /d c:\Users\Tavo\Documents\Proyectos\OpenFinanceKit

echo ========================================
echo STAGE: Adding all changes
echo ========================================
git add .

echo ========================================
echo COMMIT: Creating commit
echo ========================================
git commit -m "feat(pagos): agregar cuenta_id para descontar pagos del saldo

- Migración 002: agregar columna cuenta_id (FK -> cuentas.id, nullable)
- Motor: filtrar pagosPagados solo con cuenta_id NOT NULL
- PaymentForm: agregar select de cuenta (requerido)
- nuevo/page: query cuentas del usuario, pasar al formulario
- actions: validar cuenta_id y que pertenece al usuario
- page: JOIN a cuentas, mostrar nombre en listado

RN-001 a RN-006 validadas. Descuento de pagos aplicado correctamente."

echo ========================================
echo PUSH: Pushing to feature branch
echo ========================================
git push origin feature/pagos-cuenta

echo ========================================
echo CHECKOUT: Switching to develop
echo ========================================
git checkout develop

echo ========================================
echo MERGE: Merging feature to develop
echo ========================================
git merge feature/pagos-cuenta --no-ff -m "Merge feature/pagos-cuenta a develop (UAT)"

echo ========================================
echo PUSH: Pushing to develop (UAT)
echo ========================================
git push origin develop

echo ========================================
echo DONE: Feature merged and pushed to UAT
echo ========================================
echo.
echo Vercel deploying automatically to:
echo - Production: main branch
echo - UAT: develop branch
echo.
pause
