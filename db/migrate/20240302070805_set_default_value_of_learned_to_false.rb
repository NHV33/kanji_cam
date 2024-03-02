class SetDefaultValueOfLearnedToFalse < ActiveRecord::Migration[7.1]
  def change
    change_column_default :cards, :learned, false
  end
end
